import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyJwt, hashPassword, MockUserDbEntry } from "../../../../../lib/api-auth";
import { getUserFromDynamoDB, listUsersFromDynamoDB, mapDynamoUserToApiUser, putUserInDynamoDB, deleteUserFromDynamoDB } from "../../../../../lib/dynamodb-client";

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
    if (!caller || (caller.role !== "gff_admin" && caller.role !== "client_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const dynamoUsers = await listUsersFromDynamoDB();
    let user: any = null;

    if (dynamoUsers.length > 0) {
      const dbUser = dynamoUsers.find(u => {
        const mapped = mapDynamoUserToApiUser(u);
        return mapped.id === id;
      });
      if (dbUser) {
        user = mapDynamoUserToApiUser(dbUser);
      }
    }

    if (!user) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (caller.role === "client_admin" && user.clientAssociation !== caller.clientAssociation) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { passwordHash, ...userRes } = user;
    return NextResponse.json({ success: true, user: userRes });
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
    const dynamoUsers = await listUsersFromDynamoDB();
    let entry: [string, any] | null = null;
    let isDynamo = false;

    if (dynamoUsers.length > 0) {
      const dbUser = dynamoUsers.find(u => {
        const mapped = mapDynamoUserToApiUser(u);
        return mapped.id === id;
      });
      if (dbUser) {
        entry = [dbUser.email.toLowerCase().trim(), mapDynamoUserToApiUser(dbUser)];
        isDynamo = true;
      }
    }

    if (!entry) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const [emailKey, existing] = entry;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const { name, email, role, clientAssociation, status, clearance, password } = body;
    const updated: any = { ...existing };

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid name." }, { status: 400 });
      updated.name = name.trim();
    }
    if (clearance !== undefined) updated.clearance = clearance;
    if (clientAssociation !== undefined) updated.clientAssociation = clientAssociation;
    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
      updated.status = status;
    }
    if (role !== undefined) {
      const allowed = ["gff_admin", "client_admin", "client_member"];
      if (!allowed.includes(role)) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
      updated.role = role as any;
      if (role === "gff_admin") {
        updated.permissions = ["all:*", "read:telemetry", "write:telemetry", "read:projects", "write:projects", "read:users", "write:users", "read:clients", "write:clients", "write:governance"];
      } else if (role === "client_admin") {
        updated.permissions = ["read:telemetry", "read:projects", "write:projects", "read:ai-operations", "write:ai-operations", "read:documents", "write:documents", "write:support"];
      } else {
        updated.permissions = ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "write:support"];
      }
    }
    if (password !== undefined) {
      if (typeof password !== "string" || password.trim().length < 6) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
      updated.passwordHash = hashPassword(password);
    }
    if (email !== undefined) {
      if (typeof email !== "string" || !email.includes("@")) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
      const newEmail = email.toLowerCase().trim();
      if (newEmail !== emailKey) {
        if (await getUserFromDynamoDB(newEmail)) {
          return NextResponse.json({ success: false, error: "Conflict", message: "Email taken." }, { status: 409 });
        }
        updated.email = newEmail;
        if (isDynamo) {
          await deleteUserFromDynamoDB(emailKey);
        }
      }
    }

    if (isDynamo || dynamoUsers.length > 0) {
      await putUserInDynamoDB({
        email: updated.email,
        hashed_password: updated.passwordHash || existing.passwordHash || "password123",
        full_name: updated.name,
        name: updated.name,
        role: updated.role,
        status: updated.status,
        clientAssociation: updated.clientAssociation,
        is_active: updated.status !== "inactive",
        id: updated.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const { passwordHash: _, ...userRes } = updated;
    return NextResponse.json({ success: true, user: userRes });
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
    const dynamoUsers = await listUsersFromDynamoDB();
    let entry: [string, any] | null = null;
    let isDynamo = false;

    if (dynamoUsers.length > 0) {
      const dbUser = dynamoUsers.find(u => {
        const mapped = mapDynamoUserToApiUser(u);
        return mapped.id === id;
      });
      if (dbUser) {
        entry = [dbUser.email.toLowerCase().trim(), mapDynamoUserToApiUser(dbUser)];
        isDynamo = true;
      }
    }

    if (!entry) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const [emailKey, user] = entry;
    if (user.email === caller.email) return NextResponse.json({ success: false, error: "Forbidden", message: "Cannot delete self." }, { status: 403 });

    if (isDynamo) {
      await deleteUserFromDynamoDB(emailKey);
    }
    return NextResponse.json({ success: true, message: "User deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
