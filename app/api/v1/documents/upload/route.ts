import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { 
  verifyJwt,
  getClientIdFromAssociation, getNextDocumentId, getClientNameFromId
} from "@/lib/api-auth";
import {
  dynamoDbGetClient, dynamoDbPutPortalItem, getUserFromDynamoDB, mapDynamoUserToApiUser
} from "@/lib/dynamodb-client";

export const runtime = "nodejs";

const ALTS: Record<string, string> = {
  "client-001": "1", "1": "client-001",
  "client-002": "2", "2": "client-002",
  "client-003": "3", "3": "client-003",
  "client-004": "4", "4": "client-004"
};
const getAlt = (id: string) => ALTS[id] || "";

const getNormalizedName = (id: string) => {
  let cid = id;
  if (["1","2","3","4"].includes(cid)) cid = `client-00${cid}`;
  return getClientNameFromId(cid);
};

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
  return { status: 401, error: "Unauthorized" };
}

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    const { caller } = auth;

    const formData = await req.formData().catch(() => null);
    if (!formData) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const file = formData.get("file") as File | null;
    const clientIdRaw = formData.get("client_id") as string | null;
    if (!file || !clientIdRaw) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });

    const client_id = clientIdRaw.trim();
    const clientRecord = await dynamoDbGetClient(client_id);
    if (!clientRecord) {
      return NextResponse.json({ success: false, error: "Invalid client_id" }, { status: 400 });
    }

    if (caller.role !== "gff_admin") {
      const callerClientId = caller.client_id || getClientIdFromAssociation(caller.clientAssociation);
      if (client_id !== callerClientId && getAlt(client_id) !== callerClientId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    const project_id = (formData.get("project_id") as string || "").trim();
    const title = (formData.get("title") as string || file.name).trim();
    const document_type = (formData.get("document_type") as string || "PDF").trim();
    const version = (formData.get("version") as string || "1.0.0").trim();
    const visibility = (formData.get("visibility") as string || "private").trim();
    const description = (formData.get("description") as string || "").trim();

    const buffer = Buffer.from(await file.arrayBuffer());
    const size_kb = buffer.length / 1024;
    const fileSizeStr = size_kb > 1024 ? `${(size_kb / 1024).toFixed(1)} MB` : `${size_kb.toFixed(1)} KB`;
    const sha256_hash = `0x${crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase()}`;
    const newDocId = getNextDocumentId();

    const baseLocalS3 = path.join(process.cwd(), "backend", "local_s3_storage");
    const writeToPath = (cid: string) => {
      const uploadDir = path.join(baseLocalS3, cid, "documents", newDocId);
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, file.name), buffer);
    };

    writeToPath(client_id);
    const alt_client_id = getAlt(client_id);
    if (alt_client_id) writeToPath(alt_client_id);

    const newDoc: any = {
      id: newDocId,
      title,
      filename: file.name,
      fileSize: fileSizeStr,
      type: document_type,
      document_type,
      sha256: sha256_hash,
      client_id,
      client_name: clientRecord.name || getNormalizedName(client_id),
      projectId: project_id,
      project_id,
      status: "active",
      owner: caller.name || "Dr. Sarah Vance",
      version,
      lastUpdated: new Date().toISOString(),
      description: description || "Cryptographically secured enclave system documentation.",
      visibility: visibility === "public" ? "LEVEL_I (Client View)" : "LEVEL_IV (Restricted)",
      s3_uri: `s3://gff-ai-documents-bucket/clients/${client_id}/documents/${newDocId}/${file.name}`,
      governanceChecks: []
    };

    await dynamoDbPutPortalItem("DOCUMENT", client_id, newDoc);
    if (alt_client_id) {
      const altDoc = { 
        ...newDoc, 
        client_id: alt_client_id, 
        client_name: getNormalizedName(alt_client_id),
        s3_uri: `s3://gff-ai-documents-bucket/clients/${alt_client_id}/documents/${newDocId}/${file.name}`
      };
      await dynamoDbPutPortalItem("DOCUMENT", alt_client_id, altDoc);
    }

    return NextResponse.json({ success: true, document: newDoc }, { status: 201 });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
