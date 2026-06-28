import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyJwt, MockUserDbEntry } from "../../../../../../lib/api-auth";
import { getUserFromDynamoDB, listUsersFromDynamoDB, mapDynamoUserToApiUser, putUserInDynamoDB } from "../../../../../../lib/dynamodb-client";

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

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can change user status." }, { status: 403 });
    }

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

    if (!entry) {
      entry = (Object.entries(API_MOCK_USERS) as [string, MockUserDbEntry][]).find(([_, u]) => u.id === id) || null;
    }

    if (!entry) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const [emailKey, user] = entry;
    const body = await req.json().catch(() => null);
    if (!body || !body.status) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
    }

    const { status } = body;
    if (status !== "active" && status !== "inactive") {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Status must be 'active' or 'inactive'." }, { status: 400 });
    }

    user.status = status;

    // Update in memory mock db too
    const inMemoryMockUser = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[emailKey];
    if (inMemoryMockUser) {
      inMemoryMockUser.status = status;
    }

    if (isDynamo || dynamoUsers.length > 0) {
      await putUserInDynamoDB({
        email: user.email,
        hashed_password: user.passwordHash || (inMemoryMockUser ? inMemoryMockUser.passwordHash : undefined) || "password123",
        full_name: user.name,
        name: user.name,
        role: user.role,
        status: user.status,
        clientAssociation: user.clientAssociation,
        is_active: status !== "inactive",
        id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const { passwordHash, ...userRes } = user;

    return NextResponse.json({ success: true, user: userRes });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
