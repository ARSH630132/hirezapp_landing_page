import { NextResponse } from "next/server";
import { 
  verifyJwt,
  ApiProject, getClientNameFromId, getClientIdFromAssociation 
} from "../../../../../lib/api-auth";
import {
  getUserFromDynamoDB,
  mapDynamoUserToApiUser,
  dynamoDbListPortalItems,
  dynamoDbPutPortalItem,
  dynamoDbDeletePortalItem
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
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    
    const projects = await dynamoDbListPortalItems("PROJECT");
    const project = projects.find(p => p.id === id);
    if (!project) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (project.client_id !== cid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: true, project });
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
    
    const projects = await dynamoDbListPortalItems("PROJECT");
    const project = projects.find(p => p.id === id);
    if (!project) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const updated = { ...project };

    const fields = ["name", "phase", "status", "health", "owner", "nodesCount", "enclaveType", "desc", "client_id"];
    for (const key of fields) {
      if (body[key] !== undefined) {
        if (key === "name" && (typeof body.name !== "string" || !body.name.trim())) {
          return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid name" }, { status: 400 });
        }
        if (key === "client_id") {
          const valids = ["client-001", "client-002", "client-003", "client-004"];
          if (!valids.includes(body.client_id)) {
            return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid client_id" }, { status: 400 });
          }
          updated.client_id = body.client_id;
          updated.client_name = getClientNameFromId(body.client_id);
        } else if (key === "nodesCount") {
          if (typeof body.nodesCount !== "number") return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
          updated.nodesCount = body.nodesCount;
        } else {
          updated[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
        }
      }
    }
    updated.lastUpdated = new Date().toISOString();
    
    await dynamoDbPutPortalItem("PROJECT", updated.client_id, updated);
    
    return NextResponse.json({ success: true, project: updated });
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
    
    const projects = await dynamoDbListPortalItems("PROJECT");
    const project = projects.find(p => p.id === id);
    if (!project) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    await dynamoDbDeletePortalItem("PROJECT", project.client_id, id);
    return NextResponse.json({ success: true, message: "Project deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
