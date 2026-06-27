"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.GET = GET;
exports.PATCH = PATCH;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const api_auth_1 = require("../../../../../lib/api-auth");
const dynamodb_client_1 = require("../../../../../lib/dynamodb-client");
exports.runtime = "nodejs";
function getAuthCaller(req) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
        return null;
    const decoded = (0, api_auth_1.verifyJwt)(auth.substring(7));
    if (!decoded?.email)
        return null;
    const user = api_auth_1.API_MOCK_USERS[decoded.email.toLowerCase().trim()];
    return user && user.status !== "inactive" ? user : null;
}
async function GET(req, { params }) {
    try {
        const caller = getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const ops = await (0, dynamodb_client_1.dynamoDbListPortalItems)("AI_OPERATION");
        const op = ops.find(o => o.id === id);
        if (!op)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        if (caller.role !== "gff_admin") {
            const cid = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
            if (op.client_id !== cid) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
            }
        }
        return server_1.NextResponse.json({ success: true, operation: op });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
async function PATCH(req, { params }) {
    try {
        const caller = getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (caller.role !== "gff_admin")
            return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        const ops = await (0, dynamodb_client_1.dynamoDbListPortalItems)("AI_OPERATION");
        const op = ops.find(o => o.id === id);
        if (!op)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const body = await req.json().catch(() => null);
        if (!body)
            return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
        const fields = ["name", "project_id", "status", "health", "agent_type", "governance_status", "owner", "desc", "client_id"];
        for (const key of fields) {
            if (body[key] !== undefined) {
                if (key === "name" && (typeof body.name !== "string" || !body.name.trim())) {
                    return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Invalid name" }, { status: 400 });
                }
                if (key === "client_id") {
                    const valids = ["client-001", "client-002", "client-003", "client-004"];
                    if (!valids.includes(body.client_id)) {
                        return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id" }, { status: 400 });
                    }
                    op.client_id = body.client_id;
                    op.client_name = (0, api_auth_1.getClientNameFromId)(body.client_id);
                }
                else {
                    op[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
                }
            }
        }
        op.lastUpdated = new Date().toISOString();
        await (0, dynamodb_client_1.dynamoDbPutPortalItem)("AI_OPERATION", op.client_id, op);
        return server_1.NextResponse.json({ success: true, operation: op });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
async function DELETE(req, { params }) {
    try {
        const caller = getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (caller.role !== "gff_admin")
            return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        const ops = await (0, dynamodb_client_1.dynamoDbListPortalItems)("AI_OPERATION");
        const op = ops.find(o => o.id === id);
        if (!op)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        await (0, dynamodb_client_1.dynamoDbDeletePortalItem)("AI_OPERATION", op.client_id, id);
        return server_1.NextResponse.json({ success: true, message: "AI Operation deleted." });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
