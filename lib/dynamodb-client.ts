import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { PutCommand, ScanCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const region = process.env.AWS_REGION || "ap-south-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const tableName = process.env.DYNAMODB_USERS_TABLE || "GFF_USERS";

let docClient: DynamoDBDocumentClient | null = null;

if (accessKeyId && secretAccessKey) {
  try {
    const client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    docClient = DynamoDBDocumentClient.from(client);
    console.log("[DYNAMODB] Real AWS DynamoDB client initialized successfully.");
  } catch (err) {
    console.error("[DYNAMODB] Failed to initialize real DynamoDB client:", err);
  }
} else {
  console.log("[DYNAMODB] No AWS credentials provided. Real DynamoDB access is unavailable.");
}

export interface DynamoDbUser {
  email: string;
  hashed_password?: string;
  password_hash?: string;
  passwordHash?: string;
  full_name?: string;
  name?: string;
  role?: string;
  status?: string;
  client_id?: string | number;
  is_active?: boolean;
  id?: string | number;
  created_at?: string;
  updated_at?: string;
  clientAssociation?: string;
}

export async function getUserFromDynamoDB(email: string): Promise<DynamoDbUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (docClient) {
    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: tableName,
          Key: { email: normalizedEmail },
        })
      );
      if (response.Item) {
        return response.Item as DynamoDbUser;
      }
    } catch (err) {
      console.error(`[DYNAMODB] Error reading email ${normalizedEmail} from DynamoDB:`, err);
    }
  }
  return null;
}

export async function listUsersFromDynamoDB(): Promise<DynamoDbUser[]> {
  if (docClient) {
    try {
      const response = await docClient.send(
        new ScanCommand({
          TableName: tableName,
        })
      );
      return (response.Items || []) as DynamoDbUser[];
    } catch (err) {
      console.error("[DYNAMODB] Error listing users from DynamoDB:", err);
    }
  }
  return [];
}

export async function putUserInDynamoDB(user: DynamoDbUser): Promise<boolean> {
  if (docClient) {
    try {
      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: user,
        })
      );
      return true;
    } catch (err) {
      console.error(`[DYNAMODB] Error writing user ${user.email} to DynamoDB:`, err);
      return false;
    }
  }
  return false;
}

export async function deleteUserFromDynamoDB(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  if (docClient) {
    try {
      await docClient.send(
        new DeleteCommand({
          TableName: tableName,
          Key: { email: normalizedEmail },
        })
      );
      return true;
    } catch (err) {
      console.error(`[DYNAMODB] Error deleting user ${normalizedEmail} from DynamoDB:`, err);
      return false;
    }
  }
  return false;
}

export function hashPassword(password: string): string {
  return crypto
    .createHmac("sha256", "gff-ai-salt-2026")
    .update(password.trim())
    .digest("hex");
}

export function verifyDbUserPassword(dbUser: DynamoDbUser, passwordAttempt: string): boolean {
  const attempt = passwordAttempt.trim();
  const storedHash = dbUser.hashed_password || dbUser.password_hash || dbUser.passwordHash;
  if (!storedHash) return false;

  if (attempt === storedHash) {
    return true;
  }

  const hashedAttempt = hashPassword(attempt);
  if (hashedAttempt === storedHash) {
    return true;
  }

  try {
    if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
      return bcrypt.compareSync(attempt, storedHash);
    }
  } catch (err) {
    console.error("[BCRYPT] Comparison error:", err);
  }

  return false;
}

export function mapDynamoUserToApiUser(dbUser: DynamoDbUser): any {
  const role = dbUser.role || "client_member";
  
  let clearance = "Client member access";
  let permissions: string[] = ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "write:support"];
  
  if (role === "gff_admin") {
    clearance = "Admin access";
    permissions = [
      "all:*", "read:telemetry", "write:telemetry", "read:projects", "write:projects",
      "read:users", "write:users", "read:clients", "write:clients", "write:governance"
    ];
  } else if (role === "client_admin") {
    clearance = "Client admin access";
    permissions = [
      "read:telemetry", "read:projects", "write:projects", "read:ai-operations",
      "write:ai-operations", "read:documents", "write:documents", "write:support"
    ];
  }

  // Handle client association
  let clientAssociation = "GFF AI";
  if (role !== "gff_admin") {
    if (dbUser.clientAssociation) {
      clientAssociation = dbUser.clientAssociation;
    } else if (dbUser.client_id !== undefined && dbUser.client_id !== null) {
      clientAssociation = String(dbUser.client_id).trim().startsWith("client-")
        ? String(dbUser.client_id).trim()
        : `Client ${String(dbUser.client_id).trim()}`;
    }
  }

  const status = (dbUser.is_active === false || dbUser.status === "inactive") ? "inactive" : "active";

  const email = dbUser.email.toLowerCase().trim();

  // Deterministic user id generation based on email if not provided
  let id = dbUser.id;
  if (!id) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    id = `usr-${Math.abs(hash).toString().substring(0, 6)}`;
  }

  return {
    id: String(id),
    name: dbUser.full_name || dbUser.name || email,
    email,
    role,
    clientAssociation,
    status,
    clearance,
    permissions,
  };
}

const ENTITY_PREFIXES: Record<string, string> = { PROJECT: "PROJ#", AI_OPERATION: "AIOPS#", DOCUMENT: "DOC#", INVOICE: "INV#", SUPPORT: "TICKET#", GOVERNANCE: "GOV#" };
const DYNAMODB_CLIENTS_TABLE = process.env.DYNAMODB_CLIENTS_TABLE || "GFF_CLIENTS";
const DYNAMODB_ITEMS_TABLE = process.env.DYNAMODB_ITEMS_TABLE || "GFF_PORTAL_ITEMS";

function normalizeClientKey(clientId: string): string {
  const value = String(clientId || "").trim().toLowerCase();
  if (value === "client-001") return "1";
  if (value === "client-002") return "2";
  if (value === "client-003") return "3";
  if (value === "client-004") return "4";
  return String(clientId || "").trim();
}

export async function dynamoDbGetClient(clientId: string): Promise<any> {
  const normalizedClientId = normalizeClientKey(clientId);
  if (docClient) {
    try {
      const keys: (string | number)[] = normalizedClientId === clientId ? [normalizedClientId] : [normalizedClientId, clientId];
      if (/^\d+$/.test(normalizedClientId)) keys.push(Number(normalizedClientId));
      for (const key of keys) {
        const res = await docClient.send(new GetCommand({ TableName: DYNAMODB_CLIENTS_TABLE, Key: { client_id: key } }));
        if (res.Item) return res.Item;
      }
    } catch (err) { return null; }
  }
  return null;
}

export async function dynamoDbListClients(): Promise<any[]> {
  if (docClient) {
    try {
      const res = await docClient.send(new ScanCommand({ TableName: DYNAMODB_CLIENTS_TABLE }));
      return res.Items || [];
    } catch (err) { return []; }
  }
  return [];
}

export async function dynamoDbPutClient(client: any): Promise<any> {
  if (docClient) {
    try {
      await docClient.send(new PutCommand({ TableName: DYNAMODB_CLIENTS_TABLE, Item: client }));
      return client;
    } catch (err) { return null; }
  }
  return null;
}

export async function dynamoDbDeleteClient(clientId: string): Promise<boolean> {
  if (docClient) {
    try {
      await docClient.send(new DeleteCommand({ TableName: DYNAMODB_CLIENTS_TABLE, Key: { client_id: clientId } }));
      return true;
    } catch (err) { return false; }
  }
  return false;
}

export async function dynamoDbGetPortalItem(clientId: string, itemId: string, entityType: string): Promise<any> {
  const normalizedClientId = normalizeClientKey(clientId);
  const pk = `CLIENT#${normalizedClientId}`, sk = `${ENTITY_PREFIXES[entityType] || ""}${itemId}`;
  if (docClient) {
    try {
      const res = await docClient.send(new GetCommand({ TableName: DYNAMODB_ITEMS_TABLE, Key: { PK: pk, SK: sk } }));
      return res.Item || null;
    } catch (err) { return null; }
  }
  return null;
}

export async function dynamoDbListPortalItems(entityType: string, clientId?: string): Promise<any[]> {
  const normalizedClientId = clientId ? normalizeClientKey(clientId) : undefined;
  if (docClient) {
    try {
      if (normalizedClientId) {
        const res = await docClient.send(new QueryCommand({
          TableName: DYNAMODB_ITEMS_TABLE,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk_prefix)",
          ExpressionAttributeValues: { ":pk": `CLIENT#${normalizedClientId}`, ":sk_prefix": ENTITY_PREFIXES[entityType] || "" }
        }));
        return res.Items || [];
      } else {
        const res = await docClient.send(new ScanCommand({
          TableName: DYNAMODB_ITEMS_TABLE,
          FilterExpression: "entity_type = :entity_type",
          ExpressionAttributeValues: { ":entity_type": entityType }
        }));
        return res.Items || [];
      }
    } catch (err) { return []; }
  }
  return [];
}

export async function dynamoDbPutPortalItem(entityType: string, clientId: string, item: any): Promise<any> {
  const normalizedClientId = normalizeClientKey(clientId);
  const pk = `CLIENT#${normalizedClientId}`, sk = `${ENTITY_PREFIXES[entityType] || ""}${item.id}`;
  const dbItem = { ...item, PK: pk, SK: sk, entity_type: entityType, client_id: normalizedClientId };
  if (docClient) {
    try {
      await docClient.send(new PutCommand({ TableName: DYNAMODB_ITEMS_TABLE, Item: dbItem }));
      return item;
    } catch (err) { return null; }
  }
  return null;
}

export async function dynamoDbDeletePortalItem(entityType: string, clientId: string, itemId: string): Promise<boolean> {
  const normalizedClientId = normalizeClientKey(clientId);
  const pk = `CLIENT#${normalizedClientId}`, sk = `${ENTITY_PREFIXES[entityType] || ""}${itemId}`;
  if (docClient) {
    try {
      await docClient.send(new DeleteCommand({ TableName: DYNAMODB_ITEMS_TABLE, Key: { PK: pk, SK: sk } }));
      return true;
    } catch (err) { return false; }
  }
  return false;
}
