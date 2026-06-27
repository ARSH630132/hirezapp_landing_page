import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, API_MOCK_GOVERNANCE, API_MOCK_PROJECTS,
  verifyJwt, MockUserDbEntry, ApiGovernanceItem, 
  getNextGovernanceId, getClientNameFromId, getClientIdFromAssociation 
} from "../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization." };
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  if (!user) return { status: 401, error: "Unauthorized", msg: "User not found." };
  if (user.status === "inactive") return { status: 403, error: "Forbidden", msg: "Account inactive." };
  return { caller: user };
}

export async function GET(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    const { caller } = auth;
    const { searchParams } = new URL(req.url);
    const cid = searchParams.get("client_id");
    const pid = searchParams.get("project_id");
    const sev = searchParams.get("severity");
    const status = searchParams.get("status");
    const owner = searchParams.get("owner");
    const due = searchParams.get("due_date") || searchParams.get("due-date") || searchParams.get("dueDate");
    const search = searchParams.get("search");

    let items = Object.values(API_MOCK_GOVERNANCE) as ApiGovernanceItem[];

    if (caller.role !== "gff_admin") {
      const callerCid = getClientIdFromAssociation(caller.clientAssociation);
      items = items.filter(i => i.client_id === callerCid);
      if (cid && cid !== callerCid) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "Access denied to client governance data." }, { status: 403 });
      }
    } else if (cid) {
      items = items.filter(i => i.client_id === cid);
    }

    if (pid) items = items.filter(i => i.project_id?.toLowerCase() === pid.toLowerCase().trim());
    if (sev) items = items.filter(i => i.severity.toLowerCase() === sev.toLowerCase().trim());
    if (status) items = items.filter(i => i.status.toLowerCase() === status.toLowerCase().trim());
    if (owner) items = items.filter(i => i.owner.toLowerCase().includes(owner.toLowerCase().trim()));
    if (due) items = items.filter(i => i.due_date.toLowerCase().includes(due.toLowerCase().trim()));
    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(i => 
        i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || 
        i.owner.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) ||
        (i.standard && i.standard.toLowerCase().includes(q))
      );
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset") || searchParams.get("skip");
    const limit = limitParam ? Math.max(1, Math.min(1000, parseInt(limitParam, 10) || 100)) : 100;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

    const paginatedItems = items.slice(offset, offset + limit);

    return NextResponse.json({ success: true, governance: paginatedItems });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    const { caller } = auth;

    if (caller.role !== "gff_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only admins can create governance items." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON." }, { status: 400 });

    const { title, client_id, project_id, severity, status, owner, due_date, description, standard, nodeId, hash, logs } = body;
    if (!title?.trim() || !client_id?.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Title and client_id are required." }, { status: 400 });
    }

    const valids = ["client-001", "client-002", "client-003", "client-004"];
    if (!valids.includes(client_id)) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id." }, { status: 400 });
    }

    const id = getNextGovernanceId();
    const proj = project_id ? (API_MOCK_PROJECTS as any)[project_id] : null;

    const newGov: ApiGovernanceItem = {
      id,
      title: title.trim(),
      client_id: client_id.trim(),
      client_name: getClientNameFromId(client_id),
      project_id: project_id || undefined,
      project_name: proj ? proj.name : undefined,
      severity: severity || "Low",
      status: status || "active",
      owner: owner || caller.name,
      due_date: due_date || new Date().toISOString().split('T')[0],
      description: description || "",
      standard: standard || "ISO-27001",
      nodeId: nodeId || undefined,
      hash: hash || "0x" + Math.random().toString(16).substring(2, 10).toUpperCase(),
      logs: logs || ["Governance item created."],
      lastUpdated: new Date().toISOString()
    };

    (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id] = newGov;
    return NextResponse.json({ success: true, governance: newGov }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
