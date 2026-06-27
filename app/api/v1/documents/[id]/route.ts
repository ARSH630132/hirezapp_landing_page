import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_DOCUMENTS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiDocumentItem, 
  getClientIdFromAssociation 
} from "../../../../../lib/api-auth";

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
    let document: ApiDocumentItem | undefined = (API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[docKey];
    if (!document) {
      document = Object.values(API_MOCK_DOCUMENTS).find(
        d => d.id.toLowerCase() === docKey
      );
    }

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
    let document: ApiDocumentItem | undefined = (API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[docKey];
    let keyToUpdate = docKey;
    if (!document) {
      const entry = Object.entries(API_MOCK_DOCUMENTS).find(
        ([k, d]) => d.id.toLowerCase() === docKey
      );
      if (entry) {
        keyToUpdate = entry[0];
        document = entry[1];
      }
    }

    if (!document) return NextResponse.json({ success: false, error: "Not Found", message: "Document not found." }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON body." }, { status: 400 });
    }

    // Permitted fields to update
    const { title, status, version, owner, project_id, projectId, document_type, type, visibility, description, fileSize, sha256, governanceChecks } = body;

    if (title !== undefined) document.title = title;
    if (status !== undefined) document.status = status;
    if (version !== undefined) document.version = version;
    if (owner !== undefined) document.owner = owner;
    if (description !== undefined) document.description = description;
    if (fileSize !== undefined) document.fileSize = fileSize;
    if (sha256 !== undefined) document.sha256 = sha256;
    if (governanceChecks !== undefined) document.governanceChecks = governanceChecks;
    if (visibility !== undefined) document.visibility = visibility;

    const updatedDocType = document_type || type;
    if (updatedDocType !== undefined) {
      document.document_type = updatedDocType;
      document.type = updatedDocType;
    }

    const updatedProjectId = project_id || projectId;
    if (updatedProjectId !== undefined) {
      document.project_id = updatedProjectId;
      document.projectId = updatedProjectId;
    }

    document.lastUpdated = new Date().toISOString();

    // Ensure synchronized fields are set
    document.project_id = document.project_id || document.projectId || "";
    document.projectId = document.projectId || document.project_id || "";
    document.document_type = document.document_type || document.type || "PDF";
    document.type = document.type || document.document_type || "PDF";
    document.visibility = document.visibility || (document.client_id === "client-001" ? "LEVEL_IV (Restricted)" : "LEVEL_I (Client View)");

    (API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[keyToUpdate] = document;

    return NextResponse.json({ success: true, document });
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
    let keyToDelete: string | null = null;
    if ((API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[docKey]) {
      keyToDelete = docKey;
    } else {
      const entry = Object.entries(API_MOCK_DOCUMENTS).find(
        ([k, d]) => d.id.toLowerCase() === docKey
      );
      if (entry) {
        keyToDelete = entry[0];
      }
    }

    if (!keyToDelete) return NextResponse.json({ success: false, error: "Not Found", message: "Document not found." }, { status: 404 });

    delete (API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[keyToDelete];

    return NextResponse.json({ success: true, message: "Document deleted successfully." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
