import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { 
  API_MOCK_USERS, verifyJwt, MockUserDbEntry, 
  getClientIdFromAssociation
} from "@/lib/api-auth";
import {
  dynamoDbListPortalItems, getUserFromDynamoDB, mapDynamoUserToApiUser
} from "@/lib/dynamodb-client";

export const runtime = "nodejs";

const ALTS: Record<string, string> = {
  "client-001": "1", "1": "client-001",
  "client-002": "2", "2": "client-002",
  "client-003": "3", "3": "client-003",
  "client-004": "4", "4": "client-004"
};
const getAlt = (id: string) => ALTS[id] || "";

async function getAuth(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return { status: 401, error: "Unauthorized" };
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return { status: 401, error: "Unauthorized" };
  const email = decoded.email.toLowerCase().trim();
  const dbUser = await getUserFromDynamoDB(email);
  if (dbUser) {
    const api = mapDynamoUserToApiUser(dbUser);
    if (api.status === "inactive") return { status: 403, error: "Forbidden" };
    return { caller: api };
  }
  const u = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[email];
  if (!u) return { status: 401, error: "Unauthorized" };
  if (u.status === "inactive") return { status: 403, error: "Forbidden" };
  return { caller: u };
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const auth = await getAuth(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const { caller } = auth;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
    }

    const docKey = id.toLowerCase();
    const documents = await dynamoDbListPortalItems("DOCUMENT");
    const document = documents.find(
      d => d.id.toLowerCase() === docKey || String(d.id) === id
    );

    if (!document) {
      return NextResponse.json({ success: false, error: "Not Found", message: "Document metadata not registered." }, { status: 404 });
    }

    // RBAC policy logic
    if (caller.role !== "gff_admin") {
      const callerClientId = getClientIdFromAssociation(caller.clientAssociation);
      if (document.client_id !== callerClientId && getAlt(document.client_id) !== callerClientId) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "Access denied." }, { status: 403 });
      }
    }

    const filename_val = document.filename || document.title || "document";
    const baseLocalS3 = path.join(process.cwd(), "backend", "local_s3_storage");
    
    let filePath = path.join(baseLocalS3, document.client_id, "documents", document.id, filename_val);
    
    if (!fs.existsSync(filePath)) {
      const alt_client_id = getAlt(document.client_id);
      if (alt_client_id) {
        filePath = path.join(baseLocalS3, alt_client_id, "documents", document.id, filename_val);
      }
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "Not Found", message: "Document file not found in storage." }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename_val}"`
      }
    });

  } catch (error: any) {
    console.error("Document download error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}