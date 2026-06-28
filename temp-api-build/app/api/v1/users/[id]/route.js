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
async function getAuthCaller(req) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
        return null;
    const decoded = (0, api_auth_1.verifyJwt)(auth.substring(7));
    if (!decoded?.email)
        return null;
    const email = decoded.email.toLowerCase().trim();
    const dynamoUser = await (0, dynamodb_client_1.getUserFromDynamoDB)(email);
    if (dynamoUser) {
        const mapped = (0, dynamodb_client_1.mapDynamoUserToApiUser)(dynamoUser);
        return mapped && mapped.status !== "inactive" ? mapped : null;
    }
    const user = api_auth_1.API_MOCK_USERS[email];
    return user && user.status !== "inactive" ? user : null;
}
async function GET(req, { params }) {
    try {
        const caller = await getAuthCaller(req);
        if (!caller || (caller.role !== "gff_admin" && caller.role !== "client_admin")) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const dynamoUsers = await (0, dynamodb_client_1.listUsersFromDynamoDB)();
        let user = null;
        if (dynamoUsers.length > 0) {
            const dbUser = dynamoUsers.find(u => {
                const mapped = (0, dynamodb_client_1.mapDynamoUserToApiUser)(u);
                return mapped.id === id;
            });
            if (dbUser) {
                user = (0, dynamodb_client_1.mapDynamoUserToApiUser)(dbUser);
            }
        }
        if (!user) {
            user = Object.values(api_auth_1.API_MOCK_USERS).find(u => u.id === id);
        }
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
        const caller = await getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (caller.role !== "gff_admin")
            return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        const dynamoUsers = await (0, dynamodb_client_1.listUsersFromDynamoDB)();
        let entry = null;
        let isDynamo = false;
        if (dynamoUsers.length > 0) {
            const dbUser = dynamoUsers.find(u => {
                const mapped = (0, dynamodb_client_1.mapDynamoUserToApiUser)(u);
                return mapped.id === id;
            });
            if (dbUser) {
                entry = [dbUser.email.toLowerCase().trim(), (0, dynamodb_client_1.mapDynamoUserToApiUser)(dbUser)];
                isDynamo = true;
            }
        }
        if (!entry) {
            entry = Object.entries(api_auth_1.API_MOCK_USERS).find(([_, u]) => u.id === id) || null;
        }
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
                if (api_auth_1.API_MOCK_USERS[newEmail] || (await (0, dynamodb_client_1.getUserFromDynamoDB)(newEmail))) {
                    return server_1.NextResponse.json({ success: false, error: "Conflict", message: "Email taken." }, { status: 409 });
                }
                updated.email = newEmail;
                if (isDynamo) {
                    await (0, dynamodb_client_1.deleteUserFromDynamoDB)(emailKey);
                }
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
        if (isDynamo || dynamoUsers.length > 0) {
            await (0, dynamodb_client_1.putUserInDynamoDB)({
                email: updated.email,
                hashed_password: updated.passwordHash || existing.passwordHash || "password123",
                full_name: updated.name,
                name: updated.name,
                role: updated.role,
                status: updated.status,
                clientAssociation: updated.clientAssociation,
                is_active: updated.status !== "inactive",
                id: updated.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
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
        const caller = await getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (caller.role !== "gff_admin")
            return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        const dynamoUsers = await (0, dynamodb_client_1.listUsersFromDynamoDB)();
        let entry = null;
        let isDynamo = false;
        if (dynamoUsers.length > 0) {
            const dbUser = dynamoUsers.find(u => {
                const mapped = (0, dynamodb_client_1.mapDynamoUserToApiUser)(u);
                return mapped.id === id;
            });
            if (dbUser) {
                entry = [dbUser.email.toLowerCase().trim(), (0, dynamodb_client_1.mapDynamoUserToApiUser)(dbUser)];
                isDynamo = true;
            }
        }
        if (!entry) {
            entry = Object.entries(api_auth_1.API_MOCK_USERS).find(([_, u]) => u.id === id) || null;
        }
        if (!entry)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const [emailKey, user] = entry;
        if (user.email === caller.email)
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Cannot delete self." }, { status: 403 });
        if (isDynamo) {
            await (0, dynamodb_client_1.deleteUserFromDynamoDB)(emailKey);
        }
        delete api_auth_1.API_MOCK_USERS[emailKey];
        return server_1.NextResponse.json({ success: true, message: "User deleted." });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
