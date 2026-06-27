"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.GET = GET;
exports.PATCH = PATCH;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const api_auth_1 = require("../../../../../lib/api-auth");
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
        if (!caller || (caller.role !== "gff_admin" && caller.role !== "client_admin")) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const user = Object.values(api_auth_1.API_MOCK_USERS).find(u => u.id === id);
        if (!user)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        if (caller.role === "client_admin" && user.clientAssociation !== caller.clientAssociation) {
            return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }
        const { passwordHash, ...userRes } = user;
        return server_1.NextResponse.json({ success: true, user: userRes });
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
        const entry = Object.entries(api_auth_1.API_MOCK_USERS).find(([_, u]) => u.id === id);
        if (!entry)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const [emailKey, existing] = entry;
        const body = await req.json().catch(() => null);
        if (!body)
            return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
        const { name, email, role, clientAssociation, status, clearance, password } = body;
        const updated = { ...existing };
        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length < 2)
                return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Invalid name." }, { status: 400 });
            updated.name = name.trim();
        }
        if (clearance !== undefined)
            updated.clearance = clearance;
        if (clientAssociation !== undefined)
            updated.clientAssociation = clientAssociation;
        if (status !== undefined) {
            if (status !== "active" && status !== "inactive")
                return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
            updated.status = status;
        }
        if (role !== undefined) {
            const allowed = ["gff_admin", "client_admin", "client_member"];
            if (!allowed.includes(role))
                return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
            updated.role = role;
            if (role === "gff_admin") {
                updated.permissions = ["all:*", "read:telemetry", "write:telemetry", "read:projects", "write:projects", "read:users", "write:users", "read:clients", "write:clients", "write:governance"];
            }
            else if (role === "client_admin") {
                updated.permissions = ["read:telemetry", "read:projects", "write:projects", "read:ai-operations", "write:ai-operations", "read:documents", "write:documents", "write:support"];
            }
            else {
                updated.permissions = ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "write:support"];
            }
        }
        if (password !== undefined) {
            if (typeof password !== "string" || password.trim().length < 6)
                return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
            updated.passwordHash = (0, api_auth_1.hashPassword)(password);
        }
        if (email !== undefined) {
            if (typeof email !== "string" || !email.includes("@"))
                return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
            const newEmail = email.toLowerCase().trim();
            if (newEmail !== emailKey) {
                if (api_auth_1.API_MOCK_USERS[newEmail])
                    return server_1.NextResponse.json({ success: false, error: "Conflict", message: "Email taken." }, { status: 409 });
                updated.email = newEmail;
                delete api_auth_1.API_MOCK_USERS[emailKey];
                api_auth_1.API_MOCK_USERS[newEmail] = updated;
            }
            else {
                api_auth_1.API_MOCK_USERS[emailKey] = updated;
            }
        }
        else {
            api_auth_1.API_MOCK_USERS[emailKey] = updated;
        }
        const { passwordHash: _, ...userRes } = updated;
        return server_1.NextResponse.json({ success: true, user: userRes });
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
        const entry = Object.entries(api_auth_1.API_MOCK_USERS).find(([_, u]) => u.id === id);
        if (!entry)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const [emailKey, user] = entry;
        if (user.email === caller.email)
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Cannot delete self." }, { status: 403 });
        delete api_auth_1.API_MOCK_USERS[emailKey];
        return server_1.NextResponse.json({ success: true, message: "User deleted." });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
