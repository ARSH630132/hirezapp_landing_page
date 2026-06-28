import { NextResponse } from "next/server";
import { verifyJwt, getClientIdFromAssociation } from "../../../../../lib/api-auth";
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

    let callerClientId = getClientIdFromAssociation(caller.clientAssociation);
    const { searchParams } = new URL(req.url);
    const requestedClientId = searchParams.get("client_id");

    if (caller.role === "gff_admin") {
      if (requestedClientId) callerClientId = requestedClientId;
      else callerClientId = "client-001";
    } else {
      if (requestedClientId && requestedClientId !== callerClientId) {
        return NextResponse.json(
          { success: false, error: "Forbidden", message: "Access denied to requested client's analytics." },
          { status: 403 }
        );
      }
    }

    const projects = await dynamoDbListPortalItems("PROJECT", callerClientId);
    const operations = await dynamoDbListPortalItems("AI_OPERATION", callerClientId);
    const documents = await dynamoDbListPortalItems("DOCUMENT", callerClientId);
    const invoices = await dynamoDbListPortalItems("INVOICE", callerClientId);
    const supportTickets = await dynamoDbListPortalItems("SUPPORT", callerClientId);
    const governance = await dynamoDbListPortalItems("GOVERNANCE", callerClientId);

    const projectsByStatus: Record<string, number> = {};
    const projectsByPhase: Record<string, number> = {};
    projects.forEach(p => {
      projectsByStatus[p.status || "unknown"] = (projectsByStatus[p.status || "unknown"] || 0) + 1;
      projectsByPhase[p.phase || "unknown"] = (projectsByPhase[p.phase || "unknown"] || 0) + 1;
    });

    const operationsByStatus: Record<string, number> = {};
    const operationsByHealth: Record<string, number> = {};
    operations.forEach(o => {
      operationsByStatus[o.status || "unknown"] = (operationsByStatus[o.status || "unknown"] || 0) + 1;
      operationsByHealth[o.health || "unknown"] = (operationsByHealth[o.health || "unknown"] || 0) + 1;
    });

    const documentsByStatus: Record<string, number> = {};
    documents.forEach(d => {
      documentsByStatus[d.status || "unknown"] = (documentsByStatus[d.status || "unknown"] || 0) + 1;
    });

    const invoicesByStatus: Record<string, number> = {};
    invoices.forEach(i => {
      invoicesByStatus[i.status || "unknown"] = (invoicesByStatus[i.status || "unknown"] || 0) + 1;
    });

    const supportByStatus: Record<string, number> = {};
    const supportByPriority: Record<string, number> = {};
    supportTickets.forEach(t => {
      supportByStatus[t.status || "unknown"] = (supportByStatus[t.status || "unknown"] || 0) + 1;
      supportByPriority[t.priority || "unknown"] = (supportByPriority[t.priority || "unknown"] || 0) + 1;
    });

    const governanceByStatus: Record<string, number> = {};
    const governanceBySeverity: Record<string, number> = {};
    governance.forEach(g => {
      governanceByStatus[g.status || "unknown"] = (governanceByStatus[g.status || "unknown"] || 0) + 1;
      governanceBySeverity[g.severity || "unknown"] = (governanceBySeverity[g.severity || "unknown"] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      client_id: callerClientId,
      summary: {
        projects: { totalCount: projects.length, byStatus: projectsByStatus, byPhase: projectsByPhase },
        aiOperations: { totalCount: operations.length, byStatus: operationsByStatus, byHealth: operationsByHealth },
        documents: { totalCount: documents.length, byStatus: documentsByStatus },
        invoices: { totalCount: invoices.length, byStatus: invoicesByStatus },
        support: { totalCount: supportTickets.length, byStatus: supportByStatus, byPriority: supportByPriority },
        governance: { totalCount: governance.length, byStatus: governanceByStatus, bySeverity: governanceBySeverity }
      }
    });
  } catch (err) {
    console.error("Analytics client summary error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
