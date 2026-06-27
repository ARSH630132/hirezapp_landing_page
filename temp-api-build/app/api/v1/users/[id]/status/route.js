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
        if (caller.role !== "gff_admin") {
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can change user status." }, { status: 403 });
        }
        const { id } = await params;
        const entry = Object.entries(api_auth_1.API_MOCK_USERS).find(([_, u]) => u.id === id);
        if (!entry)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const [emailKey, user] = entry;
        const body = await req.json().catch(() => null);
        if (!body || !body.status) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
        }
        const { status } = body;
        if (status !== "active" && status !== "inactive") {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Status must be 'active' or 'inactive'." }, { status: 400 });
        }
        user.status = status;
        const { passwordHash, ...userRes } = user;
        return server_1.NextResponse.json({ success: true, user: userRes });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
