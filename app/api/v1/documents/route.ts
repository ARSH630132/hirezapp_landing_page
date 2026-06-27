import { NextResponse } from "next/server";
import crypto from "crypto";
import { 
  API_MOCK_USERS, 
  API_MOCK_DOCUMENTS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiDocumentItem, 
  getClientIdFromAssociation,
  getNextDocumentId,
  getClientNameFromId
} from "../../../../lib/api-auth";

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

export async function GET(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    const { searchParams } = new URL(req.url);
    const clientIdFilter = searchParams.get("client_id");
    const projectIdFilter = searchParams.get("project_id") || searchParams.get("projectId");
    const documentTypeFilter = searchParams.get("document_type") || searchParams.get("type");
    const statusFilter = searchParams.get("status");
    const visibilityFilter = searchParams.get("visibility");
    const searchQuery = searchParams.get("search");

    let documents = Object.values(API_MOCK_DOCUMENTS) as ApiDocumentItem[];

    // RBAC policy logic
    if (caller.role !== "gff_admin") {
      const callerClientId = getClientIdFromAssociation(caller.clientAssociation);
      documents = documents.filter(d => {
        if (d.client_id !== callerClientId) return false;
        
        // Hide GFF internal/sovereign-only or strictly confidential from client roles
        if (d.visibility) {
          const visLower = d.visibility.toLowerCase();
          if (visLower.includes("sovereign") || visLower.includes("internal") || visLower.includes("confidential")) {
            return false;
          }
        }
        return true;
      });

      // Enforce client boundaries
      if (clientIdFilter && clientIdFilter !== callerClientId) {
        return NextResponse.json(
          { success: false, error: "Forbidden", message: "Access denied to requested client's documents." },
          { status: 403 }
        );
      }
    } else {
      // Admin filter
      if (clientIdFilter) {
        documents = documents.filter(d => d.client_id === clientIdFilter);
      }
    }

    // Apply specific filters
    if (projectIdFilter) {
      const q = projectIdFilter.toLowerCase().trim();
      documents = documents.filter(d => {
        const pid = d.project_id || d.projectId || "";
        return pid.toLowerCase() === q;
      });
    }

    if (documentTypeFilter) {
      const q = documentTypeFilter.toLowerCase().trim();
      documents = documents.filter(d => {
        const dtype = d.document_type || d.type || "";
        return dtype.toLowerCase().includes(q) || dtype.toLowerCase() === q;
      });
    }

    if (statusFilter) {
      const q = statusFilter.toLowerCase().trim();
      documents = documents.filter(d => d.status.toLowerCase().includes(q) || d.status.toLowerCase() === q);
    }

    if (visibilityFilter) {
      const q = visibilityFilter.toLowerCase().trim();
      documents = documents.filter(d => {
        const vis = d.visibility || "";
        return vis.toLowerCase().includes(q) || vis.toLowerCase() === q;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      documents = documents.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q) || 
        d.owner.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
      );
    }

    // Ensure all returned items have both the unified fields to avoid client issues
    const synchronizedDocs = documents.map(d => ({
      ...d,
      project_id: d.project_id || d.projectId || "",
      projectId: d.projectId || d.project_id || "",
      document_type: d.document_type || d.type || "PDF",
      type: d.type || d.document_type || "PDF",
      visibility: d.visibility || (d.client_id === "client-001" ? "LEVEL_IV (Restricted)" : "LEVEL_I (Client View)")
    }));

    return NextResponse.json({ success: true, documents: synchronizedDocs });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    // MVP constraints: admin create/update/delete only
    if (caller.role !== "gff_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Only administrators can manage metadata." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON body." }, { status: 400 });
    }

    const { title, client_id, project_id, projectId, document_type, type, status, version, owner, visibility, description, fileSize, sha256 } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Missing or invalid 'title' field." }, { status: 400 });
    }

    if (!client_id || typeof client_id !== "string" || !client_id.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Missing or invalid 'client_id' field." }, { status: 400 });
    }

    const validClients = ["client-001", "client-002", "client-003", "client-004"];
    if (!validClients.includes(client_id)) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid 'client_id' specified." }, { status: 400 });
    }

    const newDocId = getNextDocumentId();
    const finalDocType = document_type || type || "PDF";
    const finalProjectId = project_id || projectId || "";
    const finalVisibility = visibility || (client_id === "client-001" ? "LEVEL_IV (Restricted)" : "LEVEL_I (Client View)");

    const newDoc: ApiDocumentItem = {
      id: newDocId,
      title: title.trim(),
      fileSize: fileSize || "1.0 MB",
      type: finalDocType,
      document_type: finalDocType,
      sha256: sha256 || `0x${crypto.randomBytes(20).toString("hex").toUpperCase()}`,
      client_id: client_id,
      client_name: getClientNameFromId(client_id),
      projectId: finalProjectId,
      project_id: finalProjectId,
      status: status || "Under Review",
      owner: owner || caller.name || "Dr. Sarah Vance",
      version: version || "v1.0.0",
      lastUpdated: new Date().toISOString(),
      description: description || "Cryptographically secured enclave system documentation.",
      visibility: finalVisibility,
      governanceChecks: body.governanceChecks || []
    };

    (API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[newDocId.toLowerCase()] = newDoc;

    return NextResponse.json({ success: true, document: newDoc }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}