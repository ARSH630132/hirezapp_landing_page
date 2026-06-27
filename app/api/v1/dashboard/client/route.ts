import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_PROJECTS, 
  API_MOCK_AI_OPERATIONS,
  API_MOCK_INVOICES,
  API_MOCK_GOVERNANCE,
  API_MOCK_DOCUMENTS,
  API_MOCK_SUPPORT_TICKETS,
  verifyJwt, 
  MockUserDbEntry, 
  getClientIdFromAssociation,
  ApiProject,
  ApiAiOperation,
  ApiDocumentItem,
  ApiInvoice,
  ApiSupportTicket,
  ApiGovernanceItem
} from "../../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization header." };
  }
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) {
    return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
  }
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  if (!user) {
    return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
  }
  if (user.status === "inactive") {
    return { status: 403, error: "Forbidden", msg: "This account is inactive." };
  }
  return { caller: user };
}

export async function GET(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    let callerClientId = getClientIdFromAssociation(caller.clientAssociation);
    const { searchParams } = new URL(req.url);
    const requestedClientId = searchParams.get("client_id");

    if (caller.role === "gff_admin") {
      if (requestedClientId) callerClientId = requestedClientId;
      else callerClientId = "client-001";
    } else {
      if (requestedClientId && requestedClientId !== callerClientId) {
        return NextResponse.json(
          { success: false, error: "Forbidden", message: "Access denied to requested client's dashboard." },
          { status: 403 }
        );
      }
    }

    const clientProjects = (Object.values(API_MOCK_PROJECTS) as ApiProject[]).filter(p => p.client_id === callerClientId);
    const clientOps = (Object.values(API_MOCK_AI_OPERATIONS) as ApiAiOperation[]).filter(o => o.client_id === callerClientId);
    const clientDocs = (Object.values(API_MOCK_DOCUMENTS) as ApiDocumentItem[]).filter(d => d.client_id === callerClientId);
    const clientInvoices = (Object.values(API_MOCK_INVOICES) as ApiInvoice[]).filter(i => i.client_id === callerClientId);
    const clientTickets = (Object.values(API_MOCK_SUPPORT_TICKETS) as ApiSupportTicket[]).filter(t => t.client_id === callerClientId);
    const clientGov = (Object.values(API_MOCK_GOVERNANCE) as ApiGovernanceItem[]).filter(g => g.client_id === callerClientId);

    const activeProjectsCount = clientProjects.filter(p => p.status === "active").length;
    const activeOperationsCount = clientOps.filter(o => o.status === "active").length;
    const verifiedDocsCount = clientDocs.filter(d => d.status === "Verified").length;
    const unpaidInvoicesCount = clientInvoices.filter(i => i.status === "unpaid" || i.status === "processing").length;
    const openSupportTicketsCount = clientTickets.filter(t => t.status !== "RESOLVED").length;
    const flaggedGovCount = clientGov.filter(g => g.status === "Flagged" || g.status === "Critical" || g.severity === "Critical").length;

    const recentProjects = [...clientProjects].sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()).slice(0, 5);
    const recentOperations = [...clientOps].sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()).slice(0, 5);
    const recentDocuments = [...clientDocs].sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()).slice(0, 5);
    const recentInvoices = [...clientInvoices].sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()).slice(0, 5);
    const recentSupportTickets = [...clientTickets].sort((a, b) => new Date(b.createdDate || "").getTime() - new Date(a.createdDate || "").getTime()).slice(0, 5);
    const recentGovernanceItems = [...clientGov].sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()).slice(0, 5);

    return NextResponse.json({
      success: true,
      client_id: callerClientId,
      summary: {
        projects: { activeCount: activeProjectsCount, totalCount: clientProjects.length, recent: recentProjects },
        aiOperations: { activeCount: activeOperationsCount, totalCount: clientOps.length, recent: recentOperations },
        documents: { verifiedCount: verifiedDocsCount, totalCount: clientDocs.length, recent: recentDocuments },
        invoices: { unpaidCount: unpaidInvoicesCount, totalCount: clientInvoices.length, recent: recentInvoices },
        supportTickets: { openCount: openSupportTicketsCount, totalCount: clientTickets.length, recent: recentSupportTickets },
        governance: { flaggedCount: flaggedGovCount, totalCount: clientGov.length, recent: recentGovernanceItems }
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}


