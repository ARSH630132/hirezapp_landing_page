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
        { success: false, error: "Forbidden", message: "Access denied. Only system administrators can fetch the global analytics summary." },
        { status: 403 }
      );
    }

    const projects = Object.values(API_MOCK_PROJECTS) as ApiProject[];
    const operations = Object.values(API_MOCK_AI_OPERATIONS) as ApiAiOperation[];
    const documents = Object.values(API_MOCK_DOCUMENTS) as ApiDocumentItem[];
    const invoices = Object.values(API_MOCK_INVOICES) as ApiInvoice[];
    const supportTickets = Object.values(API_MOCK_SUPPORT_TICKETS) as ApiSupportTicket[];
    const governance = Object.values(API_MOCK_GOVERNANCE) as ApiGovernanceItem[];

    // Aggregate Projects
    const projectsByStatus: Record<string, number> = {};
    const projectsByPhase: Record<string, number> = {};
    projects.forEach(p => {
      const status = p.status || "unknown";
      projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;
      const phase = p.phase || "unknown";
      projectsByPhase[phase] = (projectsByPhase[phase] || 0) + 1;
    });

    // Aggregate AI Operations
    const operationsByStatus: Record<string, number> = {};
    const operationsByHealth: Record<string, number> = {};
    operations.forEach(o => {
      const status = o.status || "unknown";
      operationsByStatus[status] = (operationsByStatus[status] || 0) + 1;
      const health = o.health || "unknown";
      operationsByHealth[health] = (operationsByHealth[health] || 0) + 1;
    });

    // Aggregate Documents
    const documentsByStatus: Record<string, number> = {};
    documents.forEach(d => {
      const status = d.status || "unknown";
      documentsByStatus[status] = (documentsByStatus[status] || 0) + 1;
    });

    // Aggregate Invoices
    const invoicesByStatus: Record<string, number> = {};
    invoices.forEach(i => {
      const status = i.status || "unknown";
      invoicesByStatus[status] = (invoicesByStatus[status] || 0) + 1;
    });

    // Aggregate Support Tickets
    const supportByStatus: Record<string, number> = {};
    const supportByPriority: Record<string, number> = {};
    supportTickets.forEach(t => {
      const status = t.status || "unknown";
      supportByStatus[status] = (supportByStatus[status] || 0) + 1;
      const priority = t.priority || "unknown";
      supportByPriority[priority] = (supportByPriority[priority] || 0) + 1;
    });

    // Aggregate Governance
    const governanceByStatus: Record<string, number> = {};
    const governanceBySeverity: Record<string, number> = {};
    governance.forEach(g => {
      const status = g.status || "unknown";
      governanceByStatus[status] = (governanceByStatus[status] || 0) + 1;
      const severity = g.severity || "unknown";
      governanceBySeverity[severity] = (governanceBySeverity[severity] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      summary: {
        projects: {
          totalCount: projects.length,
          byStatus: projectsByStatus,
          byPhase: projectsByPhase
        },
        aiOperations: {
          totalCount: operations.length,
          byStatus: operationsByStatus,
          byHealth: operationsByHealth
        },
        documents: {
          totalCount: documents.length,
          byStatus: documentsByStatus
        },
        invoices: {
          totalCount: invoices.length,
          byStatus: invoicesByStatus
        },
        support: {
          totalCount: supportTickets.length,
          byStatus: supportByStatus,
          byPriority: supportByPriority
        },
        governance: {
          totalCount: governance.length,
          byStatus: governanceByStatus,
          bySeverity: governanceBySeverity
        }
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
