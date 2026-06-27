import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiDocumentItem, 
  getClientIdFromAssociation 
} from "../../../../../lib/api-auth";
import {
  dynamoDbListPortalItems,
  dynamoDbPutPortalItem,
  dynamoDbDeletePortalItem
} from "../../../../../lib/dynamodb-client";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization header." };
  }
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) {
    return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
  }
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  if (!user) {
    return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
  }
  if (user.status === "inactive") {
    return { status: 403, error: "Forbidden", msg: "This account is inactive." };
  }
  return { caller: user };
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;
    
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const docKey = id.toLowerCase();
    const documents = await dynamoDbListPortalItems("DOCUMENT");
    const document = documents.find(
      d => d.id.toLowerCase() === docKey || d.id === id
    );

    if (!document) return NextResponse.json({ success: false, error: "Not Found", message: "Document not found." }, { status: 404 });
    
    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (document.client_id !== cid) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "Access denied." }, { status: 403 });
      }

      // Hide GFF internal/sovereign-only or strictly confidential from client roles
      if (document.visibility) {
        const visLower = document.visibility.toLowerCase();
        if (visLower.includes("sovereign") || visLower.includes("internal") || visLower.includes("confidential")) {
          return NextResponse.json({ success: false, error: "Forbidden", message: "Access denied to restricted document." }, { status: 403 });
        }
      }
    }

    // Ensure synchronized fields are returned
    const synchronizedDoc = {
      ...document,
      project_id: document.project_id || document.projectId || "",
      projectId: document.projectId || document.project_id || "",
      document_type: document.document_type || document.type || "PDF",
      type: document.type || document.document_type || "PDF",
      visibility: document.visibility || (document.client_id === "client-001" ? "LEVEL_IV (Restricted)" : "LEVEL_I (Client View)")
    };
    
    return NextResponse.json({ success: true, document: synchronizedDoc });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    // MVP constraints: admin manage only
    if (caller.role !== "gff_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Only administrators can manage metadata." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const docKey = id.toLowerCase();
    const documents = await dynamoDbListPortalItems("DOCUMENT");
    const document = documents.find(
      d => d.id.toLowerCase() === docKey || d.id === id
    );

    if (!document) return NextResponse.json({ success: false, error: "Not Found", message: "Document not found." }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON body." }, { status: 400 });
    }

    // Permitted fields to update
    const { title, status, version, owner, project_id, projectId, document_type, type, visibility, description, fileSize, sha256, governanceChecks } = body;

    const updated = { ...document };

    if (title !== undefined) updated.title = title;
    if (status !== undefined) updated.status = status;
    if (version !== undefined) updated.version = version;
    if (owner !== undefined) updated.owner = owner;
    if (description !== undefined) updated.description = description;
    if (fileSize !== undefined) updated.fileSize = fileSize;
    if (sha256 !== undefined) updated.sha256 = sha256;
    if (governanceChecks !== undefined) updated.governanceChecks = governanceChecks;
    if (visibility !== undefined) updated.visibility = visibility;

    const updatedDocType = document_type || type;
    if (updatedDocType !== undefined) {
      updated.document_type = updatedDocType;
      updated.type = updatedDocType;
    }

    const updatedProjectId = project_id || projectId;
    if (updatedProjectId !== undefined) {
      updated.project_id = updatedProjectId;
      updated.projectId = updatedProjectId;
    }

    updated.lastUpdated = new Date().toISOString();

    // Ensure synchronized fields are set
    updated.project_id = updated.project_id || updated.projectId || "";
    updated.projectId = updated.projectId || updated.project_id || "";
    updated.document_type = updated.document_type || updated.type || "PDF";
    updated.type = updated.type || updated.document_type || "PDF";
    updated.visibility = updated.visibility || (updated.client_id === "client-001" ? "LEVEL_IV (Restricted)" : "LEVEL_I (Client View)");

    await dynamoDbPutPortalItem("DOCUMENT", updated.client_id, updated);

    return NextResponse.json({ success: true, document: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    // MVP constraints: admin manage only
    if (caller.role !== "gff_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Only administrators can manage metadata." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const docKey = id.toLowerCase();
    const documents = await dynamoDbListPortalItems("DOCUMENT");
    const document = documents.find(
      d => d.id.toLowerCase() === docKey || d.id === id
    );

    if (!document) return NextResponse.json({ success: false, error: "Not Found", message: "Document not found." }, { status: 404 });

    await dynamoDbDeletePortalItem("DOCUMENT", document.client_id, document.id);

    return NextResponse.json({ success: true, message: "Document deleted successfully." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
