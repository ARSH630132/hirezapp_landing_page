import { NextResponse } from "next/server";
import { 
  verifyJwt, 
  ApiClient
} from "../../../../../lib/api-auth";
import {
  getUserFromDynamoDB,
  mapDynamoUserToApiUser,
  dynamoDbGetClient,
  dynamoDbPutClient
} from "../../../../../lib/dynamodb-client";

export const runtime = "nodejs";

async function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  const dynamoUser = await getUserFromDynamoDB(decoded.email.toLowerCase().trim());
  if (!dynamoUser) return null;
  const caller = mapDynamoUserToApiUser(dynamoUser);
  return caller.status !== "inactive" ? caller : null;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller || (caller.role !== "gff_admin" && caller.role !== "client_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const client = await dynamoDbGetClient(id);
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
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const client = await dynamoDbGetClient(id);
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

    await dynamoDbPutClient(updated);

    return NextResponse.json({ success: true, client: updated });
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
    const client = await dynamoDbGetClient(id);
    if (!client) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    client.status = "suspended";
    await dynamoDbPutClient(client);

    return NextResponse.json({ success: true, message: "Client archived successfully.", client });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
