import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, API_MOCK_GOVERNANCE, verifyJwt, MockUserDbEntry, ApiGovernanceItem 
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
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[email];
  return user && user.status !== "inactive" ? user : null;
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can change item status." }, { status: 403 });
    }

    const { id } = await params;
    const dbItems = await dynamoDbListPortalItems("GOVERNANCE");
    let item = dbItems.find(i => i.id === id);
    let isDynamo = !!item;

    if (!item) {
      item = (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id];
    }

    if (!item) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body || !body.status) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
    }

    const { status } = body;
    if (typeof status !== "string" || !status.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid status value." }, { status: 400 });
    }

    item.status = status.trim();
    item.lastUpdated = new Date().toISOString();
    
    // Memory update
    (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id] = item;

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbPutPortalItem("GOVERNANCE", item.client_id, item);
    }

    return NextResponse.json({ success: true, governance: item });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
