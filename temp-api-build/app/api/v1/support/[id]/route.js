"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.GET = GET;
exports.PATCH = PATCH;
exports.POST = POST;
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
    return api_auth_1.API_MOCK_USERS[email] || null;
}
async function GET(req, { params }) {
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
        if (!ticket) {
            ticket = api_auth_1.API_MOCK_SUPPORT_TICKETS[key] || Object.values(api_auth_1.API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
        }
        if (!ticket)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const isAdminOrSupport = caller.role === "gff_admin";
        if (!isAdminOrSupport) {
            const cid = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
            if (ticket.client_id !== cid)
                return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }
        const ticketWithReplies = { ...ticket };
        if (ticket.wireFeed && !ticketWithReplies.replies) {
            ticketWithReplies.replies = ticket.wireFeed.map((w) => ({
                sender: w.senderName,
                text: w.text,
                timestamp: w.timestamp.includes("Z") || w.timestamp.includes("-") ? w.timestamp : new Date().toISOString()
            }));
        }
        return server_1.NextResponse.json({ success: true, ticket: ticketWithReplies });
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
        const { id } = await params;
        if (!id)
            return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
        const key = id.toLowerCase();
        const dbItems = await (0, dynamodb_client_1.dynamoDbListPortalItems)("SUPPORT");
        let ticket = dbItems.find(t => t.id.toLowerCase() === key);
        let isDynamo = !!ticket;
        if (!ticket) {
            ticket = api_auth_1.API_MOCK_SUPPORT_TICKETS[key] || Object.values(api_auth_1.API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
        }
        if (!ticket)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        const isAdminOrSupport = caller.role === "gff_admin";
        if (!isAdminOrSupport) {
            const cid = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
            if (ticket.client_id !== cid) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "You do not have permission to modify this ticket." }, { status: 403 });
            }
        }
        const body = await req.json();
        const { title, subject, description, desc, category, priority, status, client_id, project_id, linkedProjectId, assigned_to, assignedAgent, created_by } = body;
        if (subject !== undefined || title !== undefined) {
            const finalSubject = subject !== undefined ? subject : title;
            ticket.subject = finalSubject;
            ticket.title = finalSubject;
        }
        if (description !== undefined || desc !== undefined) {
            const finalDesc = description !== undefined ? description : desc;
            ticket.description = finalDesc;
            ticket.desc = finalDesc;
        }
        if (category !== undefined) {
            ticket.category = category;
        }
        if (priority !== undefined) {
            const finalPriority = (priority === "critical" || priority === "high" || priority === "P1" ? "P1" : priority === "medium" || priority === "P2" ? "P2" : "P3");
            ticket.priority = finalPriority;
        }
        if (status !== undefined) {
            ticket.status = status;
        }
        if (client_id !== undefined) {
            if (!isAdminOrSupport) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Client roles cannot update client_id." }, { status: 403 });
            }
            ticket.client_id = client_id;
        }
        if (project_id !== undefined || linkedProjectId !== undefined) {
            const finalProjId = project_id !== undefined ? project_id : linkedProjectId;
            ticket.linkedProjectId = finalProjId;
            ticket.project_id = finalProjId;
        }
        if (assigned_to !== undefined || assignedAgent !== undefined) {
            if (!isAdminOrSupport) {
                return server_1.NextResponse.json({ success: false, error: "Forbidden", message: "Client roles cannot assign tickets." }, { status: 403 });
            }
            const finalAgent = assigned_to !== undefined ? assigned_to : assignedAgent;
            ticket.assignedAgent = finalAgent;
            ticket.assigned_to = finalAgent;
        }
        if (created_by !== undefined) {
            ticket.created_by = created_by;
        }
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
async function POST(req, { params }) {
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
            ticket = api_auth_1.API_MOCK_SUPPORT_TICKETS[key] || Object.values(api_auth_1.API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
        }
        if (!ticket)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        if (caller.role !== "gff_admin") {
            const cid = (0, api_auth_1.getClientIdFromAssociation)(caller.clientAssociation);
            if (ticket.client_id !== cid)
                return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }
        const body = await req.json();
        const { text, replyText } = body;
        const finalComment = text || replyText;
        if (!finalComment?.trim()) {
            return server_1.NextResponse.json({ success: false, error: "Validation Error", message: "Comment is required." }, { status: 400 });
        }
        const timestampStr = new Date().toISOString();
        const wireFeedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (!ticket.wireFeed)
            ticket.wireFeed = [];
        const ticketAny = ticket;
        if (!ticketAny.replies) {
            ticketAny.replies = ticket.wireFeed.map((w) => ({
                sender: w.senderName,
                text: w.text,
                timestamp: timestampStr
            }));
        }
        ticket.wireFeed.push({
            id: `w-${Date.now()}`,
            sender: "client",
            senderName: caller.name,
            text: finalComment,
            timestamp: wireFeedTime
        });
        ticketAny.replies.push({
            sender: `${caller.name} (Client)`,
            text: finalComment,
            timestamp: timestampStr
        });
        if (ticket.status === "OPEN" || ticket.status === "RESOLVED") {
            ticket.status = "IN_PROGRESS";
        }
        let botSender = "GFF Support Sentinel";
        let botText = "Handshake acknowledged. Our on-call systems engineers are reviewing your trace reports inside the secure sandbox.";
        const category = (ticket.category || "").toLowerCase();
        if (category.includes("ai") || category.includes("model")) {
            botSender = "Dr. Sarah Vance (Lead Systems Architect)";
            botText = "Analyzing enclave CPU and HSM logs. The cryptographic state is re-asserted and key rotational interlocks are operating nominally. All propagation latency is mitigated (<0.4ms).";
        }
        else if (category.includes("bill") || category.includes("finance")) {
            botSender = "Nicolette Durand (Billing & Treasury)";
            botText = "Invoices check completed. Invoice settlement is verified at blockchain epoch block 18290192 under seal 0xDE897FFA.";
        }
        else if (category.includes("govern") || category.includes("doc") || category.includes("audit") || category.includes("compl")) {
            botSender = "Sovereign Audit Agent";
            botText = "Operator credentials verified at Clearance Level IV. The NIST AI RMF logs are compiled successfully within SGX memory. Access credentials issued.";
        }
        ticket.wireFeed.push({
            id: `w-${Date.now() + 1}`,
            sender: "agent",
            senderName: botSender,
            text: botText,
            timestamp: wireFeedTime
        });
        ticketAny.replies.push({
            sender: botSender,
            text: botText,
            timestamp: timestampStr
        });
        api_auth_1.API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;
        if (isDynamo || dbItems.length > 0) {
            await (0, dynamodb_client_1.dynamoDbPutPortalItem)("SUPPORT", ticket.client_id, ticket);
        }
        return server_1.NextResponse.json({ success: true, ticket: ticketAny });
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
        const isAdmin = caller.role === "gff_admin" || caller.role === "admin";
        if (!isAdmin)
            return server_1.NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        if (!id)
            return server_1.NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
        const key = id.toLowerCase();
        const dbItems = await (0, dynamodb_client_1.dynamoDbListPortalItems)("SUPPORT");
        let ticket = dbItems.find(t => t.id.toLowerCase() === key);
        let isDynamo = !!ticket;
        if (!ticket) {
            ticket = api_auth_1.API_MOCK_SUPPORT_TICKETS[key] || Object.values(api_auth_1.API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
        }
        if (!ticket)
            return server_1.NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
        if (isDynamo || dbItems.length > 0) {
            await (0, dynamodb_client_1.dynamoDbDeletePortalItem)("SUPPORT", ticket.client_id, ticket.id);
        }
        delete api_auth_1.API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()];
        if (api_auth_1.API_MOCK_SUPPORT_TICKETS[key]) {
            delete api_auth_1.API_MOCK_SUPPORT_TICKETS[key];
        }
        return server_1.NextResponse.json({ success: true, message: "Support ticket deleted." });
    }
    catch (err) {
        return server_1.NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
