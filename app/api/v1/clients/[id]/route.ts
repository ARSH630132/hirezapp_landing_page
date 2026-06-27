import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_CLIENTS, 
  verifyJwt, 
  ApiClient, 
  MockUserDbEntry 
} from "../../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  return user && user.status !== "inactive" ? user : null;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller || (caller.role !== "gff_admin" && caller.role !== "client_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const client = (API_MOCK_CLIENTS as Record<string, ApiClient>)[id];
    if (!client) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (caller.role === "client_admin") {
      const associatedClientName = caller.clientAssociation;
      const cNameLow = client.name.toLowerCase();
      const assocLow = associatedClientName.toLowerCase();
      if (!cNameLow.includes(assocLow) && !assocLow.includes(cNameLow)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, client });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const client = (API_MOCK_CLIENTS as Record<string, ApiClient>)[id];
    if (!client) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const { 
      name, 
      domain, 
      status, 
      tier, 
      region, 
      complianceLevel, 
      contactName, 
      contactEmail, 
      industry, 
      accountOwner, 
      billingStatus, 
      healthStatus 
    } = body;

    const updated: ApiClient = { ...client };

    if (name !== undefined) updated.name = name;
    if (domain !== undefined) updated.domain = domain;
    if (status !== undefined) updated.status = status;
    if (tier !== undefined) updated.tier = tier;
    if (region !== undefined) updated.region = region;
    if (complianceLevel !== undefined) updated.complianceLevel = complianceLevel;
    if (contactName !== undefined) updated.contactName = contactName;
    if (contactEmail !== undefined) updated.contactEmail = contactEmail;
    if (industry !== undefined) updated.industry = industry;
    if (accountOwner !== undefined) updated.accountOwner = accountOwner;
    if (billingStatus !== undefined) updated.billingStatus = billingStatus;
    if (healthStatus !== undefined) updated.healthStatus = healthStatus;

    (API_MOCK_CLIENTS as Record<string, ApiClient>)[id] = updated;

    return NextResponse.json({ success: true, client: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!(API_MOCK_CLIENTS as Record<string, ApiClient>)[id]) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    // Instead of completely deleting, we can archive/suspend, or delete. Let's do archive/suspend or deletion.
    // The requirement says "archive if API supports it".
    // Let's change status to archived/suspended.
    const client = (API_MOCK_CLIENTS as Record<string, ApiClient>)[id];
    client.status = "suspended"; // or "archived"
    
    // We can also delete it if we want, but changing status is safer, or we can just support both.
    // Let's set status to archived/suspended as it preserves references in projects/billing, 
    // which is more robust for enterprise grade software.
    (API_MOCK_CLIENTS as Record<string, ApiClient>)[id] = client;

    return NextResponse.json({ success: true, message: "Client archived successfully.", client });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}