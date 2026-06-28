import { NextResponse } from "next/server";
import { verifyJwt } from "../../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbListPortalItems } from "../../../../../lib/dynamodb-client";

export const runtime = "nodejs";

async function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization header." };
  }
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) {
    return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
  }
  const email = decoded.email.toLowerCase().trim();

  const dynamoUser = await getUserFromDynamoDB(email);
  if (dynamoUser) {
    const mapped = mapDynamoUserToApiUser(dynamoUser);
    if (mapped.status === "inactive") return { status: 403, error: "Forbidden", msg: "This account is inactive." };
    return { caller: mapped };
  }
  return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
}

export async function GET(req: Request) {
  try {
    const auth = await getAuthCaller(req);
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

    const projects = await dynamoDbListPortalItems("PROJECT");
    const operations = await dynamoDbListPortalItems("AI_OPERATION");
    const documents = await dynamoDbListPortalItems("DOCUMENT");
    const invoices = await dynamoDbListPortalItems("INVOICE");
    const supportTickets = await dynamoDbListPortalItems("SUPPORT");
    const governance = await dynamoDbListPortalItems("GOVERNANCE");

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
    console.error("Analytics admin summary error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
