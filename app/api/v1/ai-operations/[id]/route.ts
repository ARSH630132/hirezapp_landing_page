import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, API_MOCK_AI_OPERATIONS, verifyJwt, 
  MockUserDbEntry, ApiAiOperation, getClientNameFromId, getClientIdFromAssociation 
} from "../../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  return user && user.status !== "inactive" ? user : null;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const op = (API_MOCK_AI_OPERATIONS as Record<string, ApiAiOperation>)[id];
    if (!op) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (op.client_id !== cid) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }
    return NextResponse.json({ success: true, operation: op });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    
    const { id } = await params;
    const op = (API_MOCK_AI_OPERATIONS as Record<string, ApiAiOperation>)[id];
    if (!op) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const fields = ["name", "project_id", "status", "health", "agent_type", "governance_status", "owner", "desc", "client_id"];
    for (const key of fields) {
      if (body[key] !== undefined) {
        if (key === "name" && (typeof body.name !== "string" || !body.name.trim())) {
          return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid name" }, { status: 400 });
        }
        if (key === "client_id") {
          const valids = ["client-001", "client-002", "client-003", "client-004"];
          if (!valids.includes(body.client_id)) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id" }, { status: 400 });
          }
          op.client_id = body.client_id;
          op.client_name = getClientNameFromId(body.client_id);
        } else {
          (op as any)[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
        }
      }
    }
    op.lastUpdated = new Date().toISOString();
    (API_MOCK_AI_OPERATIONS as Record<string, ApiAiOperation>)[id] = op;
    return NextResponse.json({ success: true, operation: op });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    
    const { id } = await params;
    if (!(API_MOCK_AI_OPERATIONS as Record<string, ApiAiOperation>)[id]) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }
    delete (API_MOCK_AI_OPERATIONS as Record<string, ApiAiOperation>)[id];
    return NextResponse.json({ success: true, message: "AI Operation deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
