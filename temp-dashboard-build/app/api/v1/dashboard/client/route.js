"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.GET = GET;
const server_1 = require("next/server");
const api_auth_1 = require("../../../../../lib/api-auth");
const dynamodb_client_1 = require("../../../../../lib/dynamodb-client");
exports.runtime = "nodejs";
async function getAuthCaller(req) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization header." };
    }
    const decoded = (0, api_auth_1.verifyJwt)(auth.substring(7));
    if (!decoded?.email) {
        return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
    }
    const email = decoded.email.toLowerCase().trim();
    const dynamoUser = await (0, dynamodb_client_1.getUserFromDynamoDB)(email);
    if (dynamoUser) {
        const mapped = (0, dynamodb_client_1.mapDynamoUserToApiUser)(dynamoUser);
        if (mapped.status === "inactive")
            return { status: 403, error: "Forbidden", msg: "This account is inactive." };
        return { caller: mapped };
    }
    const user = api_auth_1.API_MOCK_USERS[email];
    if (!user)
        return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
    if (user.status === "inactive")
        return { status: 403, error: "Forbidden", msg: "This account is inactive." };
    return { caller: user };
}
async function GET(req) {
    try {
        const auth = await getAuthCaller(req);
        if ("status" in auth) {
            return server_1.NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
        }
        const { caller } = auth;
        let callerClientId = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
        const { searchParams } = new URL(req.url);
        const requestedClientId = searchParams.get("client_id");
        if (caller.role === "gff_admin") {
            if (requestedClientId)
                callerClientId = requestedClientId;
            else
                callerClientId = "client-001";
        }
        else {
            if (requestedClientId && requestedClientId !== callerClientId) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Access denied to requested client's dashboard." }, { status: 403 });
            }
        }
        const clientProjects = await (0, dynamodb_client_1.dynamoDbListPortalItems)("PROJECT", callerClientId);
        const clientOps = await (0, dynamodb_client_1.dynamoDbListPortalItems)("AI_OPERATION", callerClientId);
        const clientDocs = await (0, dynamodb_client_1.dynamoDbListPortalItems)("DOCUMENT", callerClientId);
        const clientInvoices = await (0, dynamodb_client_1.dynamoDbListPortalItems)("INVOICE", callerClientId);
        const clientTickets = await (0, dynamodb_client_1.dynamoDbListPortalItems)("SUPPORT", callerClientId);
        const clientGov = await (0, dynamodb_client_1.dynamoDbListPortalItems)("GOVERNANCE", callerClientId);
        const activeProjectsCount = clientProjects.filter(p => p.status === "active").length;
        const activeOperationsCount = clientOps.filter(o => o.status === "active").length;
        const verifiedDocsCount = clientDocs.filter(d => d.status === "Verified" || d.status === "verified").length;
        const unpaidInvoicesCount = clientInvoices.filter(i => i.status === "unpaid" || i.status === "processing").length;
        const openSupportTicketsCount = clientTickets.filter(t => t.status !== "RESOLVED").length;
        const flaggedGovCount = clientGov.filter(g => g.status === "Flagged" || g.status === "Critical" || g.severity === "Critical").length;
        const sortByDate = (items) => [...items].sort((a, b) => new Date(b.lastUpdated || b.updated_at || b.createdAt || b.created_at || b.createdDate || "").getTime() -
            new Date(a.lastUpdated || a.updated_at || a.createdAt || a.created_at || a.createdDate || "").getTime()).slice(0, 5);
        return server_1.NextResponse.json({
            success: true,
            client_id: callerClientId,
            summary: {
                projects: { activeCount: activeProjectsCount, totalCount: clientProjects.length, recent: sortByDate(clientProjects) },
                aiOperations: { activeCount: activeOperationsCount, totalCount: clientOps.length, recent: sortByDate(clientOps) },
                documents: { verifiedCount: verifiedDocsCount, totalCount: clientDocs.length, recent: sortByDate(clientDocs) },
                invoices: { unpaidCount: unpaidInvoicesCount, totalCount: clientInvoices.length, recent: sortByDate(clientInvoices) },
                supportTickets: { openCount: openSupportTicketsCount, totalCount: clientTickets.length, recent: sortByDate(clientTickets) },
                governance: { flaggedCount: flaggedGovCount, totalCount: clientGov.length, recent: sortByDate(clientGov) }
            }
        });
    }
    catch (err) {
        console.error("Dashboard client summary error:", err);
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
