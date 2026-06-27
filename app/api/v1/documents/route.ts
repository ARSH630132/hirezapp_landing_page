import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_DOCUMENTS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiDocumentItem, 
  getClientIdFromAssociation 
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
    const statusFilter = searchParams.get("status");
    const typeFilter = searchParams.get("type");
    const searchQuery = searchParams.get("search");

    let documents = Object.values(API_MOCK_DOCUMENTS) as ApiDocumentItem[];

    // RBAC policy logic
    if (caller.role !== "gff_admin") {
      const callerClientId = getClientIdFromAssociation(caller.clientAssociation);
      documents = documents.filter(d => d.client_id === callerClientId);

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
    if (statusFilter) {
      const q = statusFilter.toLowerCase().trim();
      documents = documents.filter(d => d.status.toLowerCase().includes(q));
    }
    if (typeFilter) {
      const q = typeFilter.toLowerCase().trim();
      documents = documents.filter(d => d.type.toLowerCase().includes(q));
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

    return NextResponse.json({ success: true, documents });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
