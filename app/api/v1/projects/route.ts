import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_PROJECTS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiProject, 
  getNextProjectId, 
  getClientNameFromId, 
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
    const phaseFilter = searchParams.get("phase");
    const statusFilter = searchParams.get("status");
    const healthFilter = searchParams.get("health");
    const ownerFilter = searchParams.get("owner");
    const searchQuery = searchParams.get("search");

    let projects = Object.values(API_MOCK_PROJECTS) as ApiProject[];

    // RBAC policy logic
    if (caller.role !== "gff_admin") {
      const callerClientId = getClientIdFromAssociation(caller.clientAssociation);
      projects = projects.filter(p => p.client_id === callerClientId);

      // Enforce client boundaries
      if (clientIdFilter && clientIdFilter !== callerClientId) {
        return NextResponse.json(
          { success: false, error: "Forbidden", message: "Access denied to requested client's projects." },
          { status: 403 }
        );
      }
    } else {
      // Admin filter
      if (clientIdFilter) {
        projects = projects.filter(p => p.client_id === clientIdFilter);
      }
    }

    // Apply specific filters
    if (phaseFilter) {
      const q = phaseFilter.toLowerCase().trim();
      projects = projects.filter(p => p.phase.toLowerCase().includes(q));
    }
    if (statusFilter) {
      const q = statusFilter.toLowerCase().trim();
      projects = projects.filter(p => p.status.toLowerCase().includes(q));
    }
    if (healthFilter) {
      const q = healthFilter.toLowerCase().trim();
      projects = projects.filter(p => p.health.toLowerCase().includes(q));
    }
    if (ownerFilter) {
      const q = ownerFilter.toLowerCase().trim();
      projects = projects.filter(p => p.owner.toLowerCase().includes(q));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      projects = projects.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) || 
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset") || searchParams.get("skip");
    const limit = limitParam ? Math.max(1, Math.min(1000, parseInt(limitParam, 10) || 100)) : 100;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

    const paginatedProjects = projects.slice(offset, offset + limit);

    return NextResponse.json({ success: true, projects: paginatedProjects });
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

    // MVP constraints: admin create/update/archive only
    if (caller.role !== "gff_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Only administrators can create projects." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON body." }, { status: 400 });
    }

    const { name, client_id, phase, status, health, owner, nodesCount, enclaveType, desc } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Missing or invalid 'name' field." }, { status: 400 });
    }

    if (!client_id || typeof client_id !== "string" || !client_id.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Missing or invalid 'client_id' field." }, { status: 400 });
    }

    const validClients = ["client-001", "client-002", "client-003", "client-004"];
    if (!validClients.includes(client_id)) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid 'client_id' specified." }, { status: 400 });
    }

    const newProjId = getNextProjectId();
    const newProj: ApiProject = {
      id: newProjId,
      name: name.trim(),
      client_id: client_id,
      client_name: getClientNameFromId(client_id),
      phase: phase || "Phase I: Planning",
      status: status || "active",
      health: health || "On Track",
      owner: owner || caller.name,
      nodesCount: typeof nodesCount === "number" ? nodesCount : 1,
      enclaveType: enclaveType || "Intel SGX",
      desc: desc || "",
      lastUpdated: new Date().toISOString()
    };

    (API_MOCK_PROJECTS as Record<string, ApiProject>)[newProjId] = newProj;

    return NextResponse.json({ success: true, project: newProj }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
