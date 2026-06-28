import { NextResponse } from "next/server";
import { 
  verifyJwt, ApiGovernanceItem, 
  getClientNameFromId, getClientIdFromAssociation 
} from "../../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbGetClient, dynamoDbListPortalItems, dynamoDbPutPortalItem, dynamoDbDeletePortalItem } from "../../../../../lib/dynamodb-client";

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

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const dbItems = await dynamoDbListPortalItems("GOVERNANCE");
    const item = dbItems.find(i => i.id === id);

    if (!item) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (item.client_id !== cid) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }
    return NextResponse.json({ success: true, governance: item });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const dbItems = await dynamoDbListPortalItems("GOVERNANCE");
    const item = dbItems.find(i => i.id === id);

    if (!item) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const fields = [
      "title", "client_id", "project_id", "severity", "status", 
      "owner", "due_date", "description", "standard", "nodeId", "hash"
    ];

    for (const key of fields) {
      if (body[key] !== undefined) {
        if (key === "title" && (typeof body.title !== "string" || !body.title.trim())) {
          return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid title." }, { status: 400 });
        }
        if (key === "client_id") {
          const clientRecord = await dynamoDbGetClient(body.client_id);
          if (!clientRecord) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id." }, { status: 400 });
          }
          item.client_id = body.client_id;
          item.client_name = clientRecord.name || getClientNameFromId(body.client_id);
        } else if (key === "project_id") {
          item.project_id = body.project_id || undefined;
          item.project_name = body.project_id || undefined;
        } else {
          (item as any)[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
        }
      }
    }

    if (body.logs && Array.isArray(body.logs)) {
      item.logs = body.logs;
    }

    item.lastUpdated = new Date().toISOString();
    
    await dynamoDbPutPortalItem("GOVERNANCE", item.client_id, item);

    return NextResponse.json({ success: true, governance: item });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const dbItems = await dynamoDbListPortalItems("GOVERNANCE");
    const item = dbItems.find(i => i.id === id);

    if (!item) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    await dynamoDbDeletePortalItem("GOVERNANCE", item.client_id, id);
    return NextResponse.json({ success: true, message: "Governance item deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
