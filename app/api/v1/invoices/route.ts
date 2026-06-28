import { NextResponse } from "next/server";
import crypto from "crypto";
import { 
  verifyJwt,
  ApiInvoice, getNextInvoiceId, getClientNameFromId, getClientIdFromAssociation 
} from "../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbGetClient, dynamoDbListPortalItems, dynamoDbPutPortalItem } from "../../../../lib/dynamodb-client";

export const runtime = "nodejs";

async function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return { status: 401, error: "Unauthorized", msg: "Missing header." };
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return { status: 401, error: "Unauthorized", msg: "Invalid token." };
  const email = decoded.email.toLowerCase().trim();
  const dynamoUser = await getUserFromDynamoDB(email);
  if (dynamoUser) {
    const mapped = mapDynamoUserToApiUser(dynamoUser);
    if (mapped.status === "inactive") return { status: 403, error: "Forbidden", msg: "Account inactive." };
    return { caller: mapped };
  }
  return { status: 401, error: "Unauthorized", msg: "User not found." };
}

export async function GET(req: Request) {
  try {
    const auth = await getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    const { caller } = auth;
    const { searchParams: s } = new URL(req.url);
    const cliF = s.get("client_id"), projF = s.get("project_id"), statF = s.get("status"), mF = s.get("month"), startF = s.get("start_date"), endF = s.get("end_date"), searchQ = s.get("search");

    const dbItems = await dynamoDbListPortalItems("INVOICE");
    let invoices = dbItems as ApiInvoice[];

    const isMgr = caller.role === "gff_admin";

    if (!isMgr) {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      invoices = invoices.filter(i => i.client_id === cid);
      if (cliF && cliF !== cid) return NextResponse.json({ success: false, error: "Forbidden", message: "Denied" }, { status: 403 });
    } else if (cliF) {
      invoices = invoices.filter(i => i.client_id === cliF);
    }

    if (projF) invoices = invoices.filter(i => i.project_id === projF);
    if (statF) invoices = invoices.filter(i => i.status.toLowerCase() === statF.toLowerCase().trim());
    if (mF) invoices = invoices.filter(i => i.issue_date.toLowerCase().includes(mF.toLowerCase().trim()));
    if (startF && !isNaN(new Date(startF).getTime())) invoices = invoices.filter(i => new Date(i.issue_date) >= new Date(startF));
    if (endF && !isNaN(new Date(endF).getTime())) invoices = invoices.filter(i => new Date(i.issue_date) <= new Date(endF));
    if (searchQ) {
      const q = searchQ.toLowerCase().trim();
      invoices = invoices.filter(i => i.invoice_number.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || (i.project_name && i.project_name.toLowerCase().includes(q)) || i.client_name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }

    const limitParam = s.get("limit");
    const offsetParam = s.get("offset") || s.get("skip");
    const limit = limitParam ? Math.max(1, Math.min(1000, parseInt(limitParam, 10) || 100)) : 100;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

    const paginatedInvoices = invoices.slice(offset, offset + limit);

    return NextResponse.json({ success: true, invoices: paginatedInvoices });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    const { caller } = auth;
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden", message: "Forbidden" }, { status: 403 });
    const b = await req.json().catch(() => null);
    if (!b) return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON" }, { status: 400 });

    const { invoice_number: invN, client_id: cid, project_id: pid, amount: amt, currency: cur, status: st, issue_date: iss, due_date: due, category: cat, description: desc } = b;
    if (!cid || typeof cid !== "string" || !cid.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id" }, { status: 400 });
    }
    if (amt === undefined || typeof amt !== "number" || amt < 0) return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid amount" }, { status: 400 });
    const clientRecord = await dynamoDbGetClient(cid);
    if (!clientRecord) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Client not found" }, { status: 400 });
    }

    const dbItems = await dynamoDbListPortalItems("INVOICE");
    const existingInvs = dbItems;

    if (invN && typeof invN === "string" && invN.trim() && existingInvs.some(i => i.invoice_number.toLowerCase() === invN.toLowerCase().trim())) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Duplicate number" }, { status: 400 });
    }

    const nid = getNextInvoiceId();
    const finalN = invN?.trim() || `GFF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalI = iss?.trim() || new Date().toISOString().substring(0, 10);
    const finalD = due?.trim() || (() => {
      const d = new Date(finalI);
      d.setDate(d.getDate() + 30);
      return d.toISOString().substring(0, 10);
    })();

    const newInv: ApiInvoice = {
      id: nid, invoice_number: finalN, client_id: cid, client_name: clientRecord.name || getClientNameFromId(cid), project_id: pid || "", project_name: pid || "", amount: amt, currency: cur || "USD", status: st || "unpaid", issue_date: finalI, due_date: finalD, category: cat || "Compute Epoch",
      hash: b.hash || `0x${crypto.randomBytes(32).toString("hex").toUpperCase()}`, signature: b.signature || `SHA_${crypto.randomBytes(5).toString("hex").toUpperCase()}`, description: desc || "Cloud native secure enclave compute fee.", lastUpdated: new Date().toISOString()
    };
    await dynamoDbPutPortalItem("INVOICE", newInv.client_id, newInv);
    return NextResponse.json({ success: true, invoice: newInv }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
