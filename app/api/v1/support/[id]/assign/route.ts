import { NextResponse } from "next/server";
import { 
  API_MOCK_SUPPORT_TICKETS, 
  verifyJwt, 
  getClientIdFromAssociation 
} from "../../../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbListPortalItems, dynamoDbPutPortalItem } from "../../../../../../lib/dynamodb-client";

export const runtime = "nodejs";

async function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  const email = decoded.email.toLowerCase().trim();
  const dynamoUser = await getUserFromDynamoDB(email);
  if (dynamoUser) {
    const mapped = mapDynamoUserToApiUser(dynamoUser);
    return mapped && mapped.status !== "inactive" ? mapped : null;
  }
  return null;
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const dbItems = await dynamoDbListPortalItems("SUPPORT");
    let ticket = dbItems.find(t => t.id.toLowerCase() === key);
    let isDynamo = !!ticket;

    if (!ticket) {
      ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find((t: any) => t.id.toLowerCase() === key);
    }

    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const isAdminOrSupport = caller.role === "gff_admin";

    if (!isAdminOrSupport) {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only administrators can assign tickets." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || (!body.assigned_to && !body.assignedAgent)) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "assigned_to or assignedAgent is required." }, { status: 400 });
    }

    const agent = body.assigned_to || body.assignedAgent;
    ticket.assignedAgent = agent;
    (ticket as any).assigned_to = agent;
    API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbPutPortalItem("SUPPORT", ticket.client_id, ticket);
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
