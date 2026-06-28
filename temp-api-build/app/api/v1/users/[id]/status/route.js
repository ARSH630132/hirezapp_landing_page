"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.PATCH = PATCH;
const server_1 = require("next/server");
const api_auth_1 = require("../../../../../../lib/api-auth");
const dynamodb_client_1 = require("../../../../../../lib/dynamodb-client");
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
async function PATCH(req, { params }) {
    try {
        const caller = await getAuthCaller(req);
        if (!caller)
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (caller.role !== "gff_admin") {
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can change user status." }, { status: 403 });
        }
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
        const body = await req.json().catch(() => null);
        if (!body || !body.status) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
        }
        const { status } = body;
        if (status !== "active" && status !== "inactive") {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "Status must be 'active' or 'inactive'." }, { status: 400 });
        }
        user.status = status;
        // Update in memory mock db too
        const inMemoryMockUser = api_auth_1.API_MOCK_USERS[emailKey];
        if (inMemoryMockUser) {
            inMemoryMockUser.status = status;
        }
        if (isDynamo || dynamoUsers.length > 0) {
            await (0, dynamodb_client_1.putUserInDynamoDB)({
                email: user.email,
                hashed_password: user.passwordHash || (inMemoryMockUser ? inMemoryMockUser.passwordHash : undefined) || "password123",
                full_name: user.name,
                name: user.name,
                role: user.role,
                status: user.status,
                clientAssociation: user.clientAssociation,
                is_active: status !== "inactive",
                id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
        const { passwordHash, ...userRes } = user;
        return server_1.NextResponse.json({ success: true, user: userRes });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
