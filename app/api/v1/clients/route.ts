import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_CLIENTS, 
  verifyJwt, 
  getNextClientId, 
  ApiClient, 
  MockUserDbEntry 
} from "../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return { status: 401, error: "Unauthorized", msg: "Missing/malformed Authorization header." };
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  if (!user) return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
  if (user.status === "inactive") return { status: 403, error: "Forbidden", msg: "This account is inactive." };
  return { caller: user };
}

export async function GET(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    const { caller } = auth;
    if (caller.role !== "gff_admin" && caller.role !== "client_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Access denied. Admin role required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const regionFilter = searchParams.get("region");
    const industryFilter = searchParams.get("industry");
    const tierFilter = searchParams.get("tier");
    const searchQuery = searchParams.get("search");

    let clients = Object.values(API_MOCK_CLIENTS) as ApiClient[];

    if (caller.role === "client_admin") {
      // client_admin can only view their own associated client
      const associatedClientName = caller.clientAssociation;
      clients = clients.filter(c => {
        const cNameLow = c.name.toLowerCase();
        const assocLow = associatedClientName.toLowerCase();
        return cNameLow.includes(assocLow) || assocLow.includes(cNameLow);
      });
    }

    if (statusFilter) {
      clients = clients.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (regionFilter) {
      clients = clients.filter(c => c.region.toLowerCase() === regionFilter.toLowerCase());
    }
    if (industryFilter) {
      clients = clients.filter(c => c.industry.toLowerCase() === industryFilter.toLowerCase());
    }
    if (tierFilter) {
      clients = clients.filter(c => c.tier.toLowerCase() === tierFilter.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      clients = clients.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.domain.toLowerCase().includes(q) || 
        c.id.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, clients });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    if (auth.caller.role !== "gff_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can register new clients." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON." }, { status: 400 });

    const { 
      name, 
      domain, 
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

    if (!name?.trim() || !domain?.trim() || !tier || !region) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Missing required fields (name, domain, tier, region)." }, { status: 400 });
    }

    // Ensure uniqueness of domain or name
    const domainNorm = domain.toLowerCase().trim();
    const domainExists = Object.values(API_MOCK_CLIENTS).some(c => c.domain.toLowerCase() === domainNorm);
    if (domainExists) {
      return NextResponse.json({ success: false, error: "Conflict", message: "A client with this domain already exists." }, { status: 409 });
    }

    const newClientId = getNextClientId();
    const newClient: ApiClient = {
      id: newClientId,
      name: name.trim(),
      domain: domainNorm,
      status: "active",
      tier: tier as any,
      createdAt: new Date().toISOString(),
      region: region,
      complianceLevel: complianceLevel || (tier === "Sovereign" ? "ISO-27001 Fully Certified" : "SOC2 Type II Assured"),
      contactName: contactName?.trim() || "Sovereign Operator",
      contactEmail: contactEmail?.trim() || `operator@${domainNorm}`,
      industry: industry || "Cybersecurity & Defense",
      accountOwner: accountOwner || auth.caller.name,
      billingStatus: billingStatus || "Paid",
      healthStatus: healthStatus || "Healthy"
    };

    (API_MOCK_CLIENTS as Record<string, ApiClient>)[newClientId] = newClient;
    return NextResponse.json({ success: true, client: newClient }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}