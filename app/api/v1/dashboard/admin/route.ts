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
  ApiProject,
  ApiAiOperation,
  ApiDocumentItem,
  ApiInvoice,
  ApiSupportTicket,
  ApiGovernanceItem
} from "../../../../../lib/api-auth";

export const runtime = "nodejs";

const ALL_CLIENTS = [
  { id: "client-001", name: "Apex Sovereign Group [Preview Client]", status: "active", tier: "Sovereign", region: "London", createdAt: "2026-01-15T08:00:00Z" },
  { id: "client-002", name: "Global Retail Enclave [Preview Client]", status: "active", tier: "Enterprise", region: "New York", createdAt: "2026-02-10T10:30:00Z" },
  { id: "client-003", name: "Sovereign Logistics Unit [Preview Client]", status: "active", tier: "Standard", region: "Frankfurt", createdAt: "2026-03-01T09:00:00Z" },
  { id: "client-004", name: "Federal Treasury Division [Preview Client]", status: "active", tier: "Sovereign", region: "Washington D.C.", createdAt: "2026-04-18T14:15:00Z" }
];

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

    if (caller.role !== "gff_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Access denied. Only system administrators can fetch the global admin dashboard summary." },
        { status: 403 }
      );
    }

    const projects = Object.values(API_MOCK_PROJECTS) as ApiProject[];
    const operations = Object.values(API_MOCK_AI_OPERATIONS) as ApiAiOperation[];
    const documents = Object.values(API_MOCK_DOCUMENTS) as ApiDocumentItem[];
    const invoices = Object.values(API_MOCK_INVOICES) as ApiInvoice[];
    const supportTickets = Object.values(API_MOCK_SUPPORT_TICKETS) as ApiSupportTicket[];
    const governance = Object.values(API_MOCK_GOVERNANCE) as ApiGovernanceItem[];

    const activeProjectsCount = projects.filter(p => p.status === "active").length;
    const activeOperationsCount = operations.filter(o => o.status === "active").length;
    const verifiedDocsCount = documents.filter(d => d.status === "Verified").length;
    const unpaidInvoicesCount = invoices.filter(i => i.status === "unpaid" || i.status === "processing").length;
    const openSupportTicketsCount = supportTickets.filter(t => t.status !== "RESOLVED").length;
    const flaggedGovCount = governance.filter(g => g.status === "Flagged" || g.status === "Critical" || g.severity === "Critical").length;

    const recentClients = [...ALL_CLIENTS]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const recentProjects = [...projects]
      .sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime())
      .slice(0, 5);

    const recentOperations = [...operations]
      .sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime())
      .slice(0, 5);

    const recentDocuments = [...documents]
      .sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime())
      .slice(0, 5);

    const recentInvoices = [...invoices]
      .sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime())
      .slice(0, 5);

    const recentSupportTickets = [...supportTickets]
      .sort((a, b) => new Date(b.createdDate || "").getTime() - new Date(a.createdDate || "").getTime())
      .slice(0, 5);

    const recentGovernanceItems = [...governance]
      .sort((a, b) => new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime())
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      summary: {
        clients: {
          totalCount: ALL_CLIENTS.length,
          recent: recentClients
        },
        projects: {
          activeCount: activeProjectsCount,
          totalCount: projects.length,
          recent: recentProjects
        },
        aiOperations: {
          activeCount: activeOperationsCount,
          totalCount: operations.length,
          recent: recentOperations
        },
        documents: {
          verifiedCount: verifiedDocsCount,
          totalCount: documents.length,
          recent: recentDocuments
        },
        invoices: {
          unpaidCount: unpaidInvoicesCount,
          totalCount: invoices.length,
          recent: recentInvoices
        },
        support: {
          openCount: openSupportTicketsCount,
          totalCount: supportTickets.length,
          recent: recentSupportTickets
        },
        governance: {
          flaggedCount: flaggedGovCount,
          totalCount: governance.length,
          recent: recentGovernanceItems
        }
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}


