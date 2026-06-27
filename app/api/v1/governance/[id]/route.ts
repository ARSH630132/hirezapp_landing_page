import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, API_MOCK_GOVERNANCE, API_MOCK_PROJECTS,
  verifyJwt, MockUserDbEntry, ApiGovernanceItem, 
  getClientNameFromId, getClientIdFromAssociation 
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
    const item = (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id];
    if (!item) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (item.client_id !== cid) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }
    return NextResponse.json({ success: true, governance: item });
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
    const item = (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id];
    if (!item) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const fields = [
      "title", "client_id", "project_id", "severity", "status", 
      "owner", "due_date", "description", "standard", "nodeId", "hash"
    ];

    for (const key of fields) {
      if (body[key] !== undefined) {
        if (key === "title" && (typeof body.title !== "string" || !body.title.trim())) {
          return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid title." }, { status: 400 });
        }
        if (key === "client_id") {
          const valids = ["client-001", "client-002", "client-003", "client-004"];
          if (!valids.includes(body.client_id)) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id." }, { status: 400 });
          }
          item.client_id = body.client_id;
          item.client_name = getClientNameFromId(body.client_id);
        } else if (key === "project_id") {
          item.project_id = body.project_id || undefined;
          if (body.project_id) {
            const proj = (API_MOCK_PROJECTS as any)[body.project_id];
            item.project_name = proj ? proj.name : undefined;
          } else {
            item.project_name = undefined;
          }
        } else {
          (item as any)[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
        }
      }
    }

    if (body.logs && Array.isArray(body.logs)) {
      item.logs = body.logs;
    }

    item.lastUpdated = new Date().toISOString();
    (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id] = item;
    return NextResponse.json({ success: true, governance: item });
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
    if (!(API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id]) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    delete (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id];
    return NextResponse.json({ success: true, message: "Governance item deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
