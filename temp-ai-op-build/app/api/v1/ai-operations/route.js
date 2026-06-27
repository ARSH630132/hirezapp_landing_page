"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const api_auth_1 = require("../../../../lib/api-auth");
exports.runtime = "nodejs";
function getAuthCaller(req) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization header." };
    }
    const decoded = (0, api_auth_1.verifyJwt)(auth.substring(7));
    if (!decoded?.email) {
        return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
    }
    const user = api_auth_1.API_MOCK_USERS[decoded.email.toLowerCase().trim()];
    if (!user) {
        return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
    }
    if (user.status === "inactive") {
        return { status: 403, error: "Forbidden", msg: "This account is inactive." };
    }
    return { caller: user };
}
async function GET(req) {
    try {
        const auth = getAuthCaller(req);
        if ("status" in auth) {
            return server_1.NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
        }
        const { caller } = auth;
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get("client_id");
        const pid = searchParams.get("project_id");
        const status = searchParams.get("status");
        const health = searchParams.get("health");
        const agent_type = searchParams.get("agent_type");
        const gov_status = searchParams.get("governance_status");
        const owner = searchParams.get("owner");
        const search = searchParams.get("search");
        let ops = Object.values(api_auth_1.API_MOCK_AI_OPERATIONS);
        if (caller.role !== "gff_admin") {
            const callerCid = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
            ops = ops.filter(o => o.client_id === callerCid);
            if (cid && cid !== callerCid) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Access denied." }, { status: 403 });
            }
        }
        else if (cid) {
            ops = ops.filter(o => o.client_id === cid);
        }
        if (pid)
            ops = ops.filter(o => o.project_id.toLowerCase() === pid.toLowerCase().trim());
        if (status)
            ops = ops.filter(o => o.status.toLowerCase() === status.toLowerCase().trim());
        if (health)
            ops = ops.filter(o => o.health.toLowerCase() === health.toLowerCase().trim());
        if (agent_type)
            ops = ops.filter(o => o.agent_type.toLowerCase() === agent_type.toLowerCase().trim());
        if (gov_status)
            ops = ops.filter(o => o.governance_status.toLowerCase() === gov_status.toLowerCase().trim());
        if (owner)
            ops = ops.filter(o => o.owner.toLowerCase().includes(owner.toLowerCase().trim()));
        if (search) {
            const q = search.toLowerCase().trim();
            ops = ops.filter(o => o.name.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q) || o.owner.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
        }
        const limitParam = searchParams.get("limit");
        const offsetParam = searchParams.get("offset") || searchParams.get("skip");
        const limit = limitParam ? Math.max(1, Math.min(1000, parseInt(limitParam, 10) || 100)) : 100;
        const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;
        const paginatedOps = ops.slice(offset, offset + limit);
        return server_1.NextResponse.json({ success: true, operations: paginatedOps });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
async function POST(req) {
    try {
        const auth = getAuthCaller(req);
        if ("status" in auth) {
            return server_1.NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
        }
        const { caller } = auth;
        if (caller.role !== "gff_admin") {
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Only administrators can create." }, { status: 403 });
        }
        const body = await req.json().catch(() => null);
        if (!body) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON body." }, { status: 400 });
        }
        const { name, client_id, project_id, status, health, agent_type, governance_status, owner, desc } = body;
        if (!name?.trim() || !client_id?.trim() || !project_id?.trim()) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Missing required fields." }, { status: 400 });
        }
        const valids = ["client-001", "client-002", "client-003", "client-004"];
        if (!valids.includes(client_id)) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id." }, { status: 400 });
        }
        const newOpId = (0, api_auth_1.getNextAiOperationId)();
        const newOp = {
            id: newOpId,
            name: name.trim(),
            client_id: client_id.trim(),
            client_name: (0, api_auth_1.getClientNameFromId)(client_id),
            project_id: project_id.trim(),
            status: status || "active",
            health: health || "healthy",
            agent_type: agent_type || "autonomous",
            governance_status: governance_status || "compliant",
            owner: owner || caller.name,
            desc: desc || "",
            lastUpdated: new Date().toISOString()
        };
        api_auth_1.API_MOCK_AI_OPERATIONS[newOpId] = newOp;
        return server_1.NextResponse.json({ success: true, operation: newOp }, { status: 201 });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
