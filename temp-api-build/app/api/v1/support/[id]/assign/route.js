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
        const { id } = await params;
        if (!id)
            return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
        const key = id.toLowerCase();
        const dbItems = await (0, dynamodb_client_1.dynamoDbListPortalItems)("SUPPORT");
        let ticket = dbItems.find(t => t.id.toLowerCase() === key);
        let isDynamo = !!ticket;
        if (!ticket) {
            ticket = api_auth_1.API_MOCK_SUPPORT_TICKETS[key] || Object.values(api_auth_1.API_MOCK_SUPPORT_TICKETS).find((t) => t.id.toLowerCase() === key);
        }
        if (!ticket)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const isAdminOrSupport = caller.role === "gff_admin";
        if (!isAdminOrSupport) {
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Only administrators can assign tickets." }, { status: 403 });
        }
        const body = await req.json().catch(() => null);
        if (!body || (!body.assigned_to && !body.assignedAgent)) {
            return server_1.NextResponse.json({ success: false, error: "Bad Request", message: "assigned_to or assignedAgent is required." }, { status: 400 });
        }
        const agent = body.assigned_to || body.assignedAgent;
        ticket.assignedAgent = agent;
        ticket.assigned_to = agent;
        api_auth_1.API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;
        if (isDynamo || dbItems.length > 0) {
            await (0, dynamodb_client_1.dynamoDbPutPortalItem)("SUPPORT", ticket.client_id, ticket);
        }
        return server_1.NextResponse.json({ success: true, ticket });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
