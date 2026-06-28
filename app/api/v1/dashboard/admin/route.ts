import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyJwt, MockUserDbEntry } from "../../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbListClients, dynamoDbListPortalItems } from "../../../../../lib/dynamodb-client";

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

  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[email];
  if (!user) return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
  if (user.status === "inactive") return { status: 403, error: "Forbidden", msg: "This account is inactive." };
  return { caller: user };
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
        { success: false, error: "Forbidden", message: "Access denied. Only system administrators can fetch the global admin dashboard summary." },
        { status: 403 }
      );
    }

    const clients = await dynamoDbListClients();
    const projects = await dynamoDbListPortalItems("PROJECT");
    const operations = await dynamoDbListPortalItems("AI_OPERATION");
    const documents = await dynamoDbListPortalItems("DOCUMENT");
    const invoices = await dynamoDbListPortalItems("INVOICE");
    const supportTickets = await dynamoDbListPortalItems("SUPPORT");
    const governance = await dynamoDbListPortalItems("GOVERNANCE");

    const activeProjectsCount = projects.filter(p => p.status === "active").length;
    const activeOperationsCount = operations.filter(o => o.status === "active").length;
    const verifiedDocsCount = documents.filter(d => d.status === "Verified" || d.status === "verified").length;
    const unpaidInvoicesCount = invoices.filter(i => i.status === "unpaid" || i.status === "processing").length;
    const openSupportTicketsCount = supportTickets.filter(t => t.status !== "RESOLVED").length;
    const flaggedGovCount = governance.filter(g => g.status === "Flagged" || g.status === "Critical" || g.severity === "Critical").length;

    const recentClients = [...clients]
      .sort((a, b) => new Date(b.createdAt || b.created_at || "").getTime() - new Date(a.createdAt || a.created_at || "").getTime());

    const sortByDate = (items: any[]) => [...items].sort((a, b) => 
      new Date(b.lastUpdated || b.updated_at || b.createdAt || b.created_at || b.createdDate || "").getTime() - 
      new Date(a.lastUpdated || a.updated_at || a.createdAt || a.created_at || a.createdDate || "").getTime()
    ).slice(0, 5);

    return NextResponse.json({
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
  } catch (err) {
    console.error("Dashboard admin summary error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}



