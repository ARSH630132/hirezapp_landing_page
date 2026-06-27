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
        if (caller.role !== "gff_admin") {
            return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Access denied. Only system administrators can fetch the global admin dashboard summary." }, { status: 403 });
        }
        const clients = await (0, dynamodb_client_1.dynamoDbListClients)();
        const projects = await (0, dynamodb_client_1.dynamoDbListPortalItems)("PROJECT");
        const operations = await (0, dynamodb_client_1.dynamoDbListPortalItems)("AI_OPERATION");
        const documents = await (0, dynamodb_client_1.dynamoDbListPortalItems)("DOCUMENT");
        const invoices = await (0, dynamodb_client_1.dynamoDbListPortalItems)("INVOICE");
        const supportTickets = await (0, dynamodb_client_1.dynamoDbListPortalItems)("SUPPORT");
        const governance = await (0, dynamodb_client_1.dynamoDbListPortalItems)("GOVERNANCE");
        const activeProjectsCount = projects.filter(p => p.status === "active").length;
        const activeOperationsCount = operations.filter(o => o.status === "active").length;
        const verifiedDocsCount = documents.filter(d => d.status === "Verified" || d.status === "verified").length;
        const unpaidInvoicesCount = invoices.filter(i => i.status === "unpaid" || i.status === "processing").length;
        const openSupportTicketsCount = supportTickets.filter(t => t.status !== "RESOLVED").length;
        const flaggedGovCount = governance.filter(g => g.status === "Flagged" || g.status === "Critical" || g.severity === "Critical").length;
        const recentClients = [...clients]
            .sort((a, b) => new Date(b.createdAt || b.created_at || "").getTime() - new Date(a.createdAt || a.created_at || "").getTime());
        const sortByDate = (items) => [...items].sort((a, b) => new Date(b.lastUpdated || b.updated_at || b.createdAt || b.created_at || b.createdDate || "").getTime() -
            new Date(a.lastUpdated || a.updated_at || a.createdAt || a.created_at || a.createdDate || "").getTime()).slice(0, 5);
        return server_1.NextResponse.json({
            success: true,
            summary: {
                clients: { totalCount: clients.length, recent: recentClients },
                projects: { activeCount: activeProjectsCount, totalCount: projects.length, recent: sortByDate(projects) },
                aiOperations: { activeCount: activeOperationsCount, totalCount: operations.length, recent: sortByDate(operations) },
                documents: { verifiedCount: verifiedDocsCount, totalCount: documents.length, recent: sortByDate(documents) },
                invoices: { unpaidCount: unpaidInvoicesCount, totalCount: invoices.length, recent: sortByDate(invoices) },
                support: { openCount: openSupportTicketsCount, totalCount: supportTickets.length, recent: sortByDate(supportTickets) },
                governance: { flaggedCount: flaggedGovCount, totalCount: governance.length, recent: sortByDate(governance) }
            }
        });
    }
    catch (err) {
        console.error("Dashboard admin summary error:", err);
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
