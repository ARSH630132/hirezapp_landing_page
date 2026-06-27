"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.PATCH = PATCH;
const server_1 = require("next/server");
const api_auth_1 = require("../../../../../../lib/api-auth");
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
async function PATCH(req, { params }) {
    try {
        const caller = getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        if (!id)
            return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
        const key = id.toLowerCase();
        const ticket = api_auth_1.API_MOCK_SUPPORT_TICKETS[key] || Object.values(api_auth_1.API_MOCK_SUPPORT_TICKETS).find((t) => t.id.toLowerCase() === key);
        if (!ticket)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const isAdminOrSupport = caller.role === "gff_admin" || caller.role === "support_agent" || caller.role === "admin" || caller.permissions?.includes("write:support");
        if (!isAdminOrSupport) {
            const cid = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
            if (ticket.client_id !== cid) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "You do not have permission to modify this ticket." }, { status: 403 });
            }
        }
        const body = await req.json().catch(() => null);
        if (!body || !body.status) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
        }
        ticket.status = body.status;
        api_auth_1.API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;
        return server_1.NextResponse.json({ success: true, ticket });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
