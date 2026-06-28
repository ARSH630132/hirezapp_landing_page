import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, API_MOCK_INVOICES, verifyJwt, 
  MockUserDbEntry, ApiInvoice, getClientIdFromAssociation, getClientNameFromId, API_MOCK_PROJECTS
} from "../../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbListPortalItems, dynamoDbPutPortalItem, dynamoDbDeletePortalItem } from "../../../../../lib/dynamodb-client";

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

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const dbItems = await dynamoDbListPortalItems("INVOICE");
    let invoice = dbItems.find(i => i.id === id);

    if (!invoice) {
      invoice = (API_MOCK_INVOICES as Record<string, ApiInvoice>)[id];
    }

    if (!invoice) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const isMgr = caller.role === "gff_admin";
    if (!isMgr) {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (invoice.client_id !== cid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: true, invoice });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const isMgr = caller.role === "gff_admin";
    if (!isMgr) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const dbItems = await dynamoDbListPortalItems("INVOICE");
    let invoice = dbItems.find(i => i.id === id);
    let isDynamo = !!invoice;

    if (!invoice) {
      invoice = (API_MOCK_INVOICES as Record<string, ApiInvoice>)[id];
    }

    if (!invoice) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const fields = [
      "invoice_number", "client_id", "project_id", "amount", 
      "currency", "status", "issue_date", "due_date", 
      "category", "description", "hash", "signature"
    ];

    for (const key of fields) {
      if (body[key] !== undefined) {
        if (key === "client_id") {
          const valids = ["client-001", "client-002", "client-003", "client-004"];
          if (!valids.includes(body.client_id)) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id" }, { status: 400 });
          }
          invoice.client_id = body.client_id;
          invoice.client_name = getClientNameFromId(body.client_id);
        } else if (key === "amount") {
          if (typeof body.amount !== "number" || body.amount < 0) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid amount" }, { status: 400 });
          }
          invoice.amount = body.amount;
        } else if (key === "project_id") {
          invoice.project_id = body.project_id;
          invoice.project_name = body.project_id ? (API_MOCK_PROJECTS[body.project_id]?.name || "") : "";
        } else if (key === "invoice_number") {
          if (typeof body.invoice_number !== "string" || !body.invoice_number.trim()) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid invoice_number" }, { status: 400 });
          }
          const otherInvs = dbItems.length > 0 
            ? dbItems.filter(inv => inv.id !== id) 
            : Object.values(API_MOCK_INVOICES).filter(inv => inv.id !== id);
            
          if (otherInvs.some(inv => inv.invoice_number.toLowerCase() === body.invoice_number.toLowerCase().trim())) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invoice number already exists" }, { status: 400 });
          }
          invoice.invoice_number = body.invoice_number.trim();
        } else {
          (invoice as any)[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
        }
      }
    }

    invoice.lastUpdated = new Date().toISOString();
    
    // Memory update
    (API_MOCK_INVOICES as Record<string, ApiInvoice>)[id] = invoice;

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbPutPortalItem("INVOICE", invoice.client_id, invoice);
    }

    return NextResponse.json({ success: true, invoice });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const isMgr = caller.role === "gff_admin";
    if (!isMgr) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const dbItems = await dynamoDbListPortalItems("INVOICE");
    let invoice = dbItems.find(i => i.id === id);
    let isDynamo = !!invoice;

    if (!invoice) {
      invoice = (API_MOCK_INVOICES as Record<string, ApiInvoice>)[id];
    }

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbDeletePortalItem("INVOICE", invoice.client_id, id);
    }
    delete (API_MOCK_INVOICES as Record<string, ApiInvoice>)[id];
    return NextResponse.json({ success: true, message: "Invoice deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
