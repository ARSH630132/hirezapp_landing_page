import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyJwt, hashPassword, getNextUserId, MockUserDbEntry } from "../../../../lib/api-auth";

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
    const roleFilter = searchParams.get("role");
    const statusFilter = searchParams.get("status");
    const clientIdFilter = searchParams.get("client_id");
    const searchQuery = searchParams.get("search");

    let users = Object.values(API_MOCK_USERS) as MockUserDbEntry[];
    if (caller.role === "client_admin") {
      users = users.filter(u => u.clientAssociation === caller.clientAssociation);
    }
    if (roleFilter) users = users.filter(u => u.role === roleFilter);
    if (statusFilter) users = users.filter(u => u.status === statusFilter);
    if (clientIdFilter) {
      const low = clientIdFilter.toLowerCase();
      users = users.filter(u => u.clientAssociation?.toLowerCase().includes(low) || u.id === clientIdFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset") || searchParams.get("skip");
    const limit = limitParam ? Math.max(1, Math.min(1000, parseInt(limitParam, 10) || 100)) : 100;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

    const paginatedUsers = users.slice(offset, offset + limit);

    return NextResponse.json({ success: true, users: paginatedUsers.map(({ passwordHash, ...u }) => u) });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    if (auth.caller.role !== "gff_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only gff_admin can create users." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid JSON." }, { status: 400 });

    const { name, email, role, clientAssociation, status, clearance, password } = body;
    if (!name?.trim() || !email?.includes("@") || !role || !password || password.length < 6) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Missing or invalid required fields." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if ((API_MOCK_USERS as Record<string, MockUserDbEntry>)[normalizedEmail]) {
      return NextResponse.json({ success: false, error: "Conflict", message: "User already exists." }, { status: 409 });
    }

    const allowedRoles = ["gff_admin", "client_admin", "client_member"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid role specified." }, { status: 400 });
    }

    let permissions = ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "write:support"];
    if (role === "gff_admin") {
      permissions = ["all:*", "read:telemetry", "write:telemetry", "read:projects", "write:projects", "read:users", "write:users", "read:clients", "write:clients", "write:governance"];
    } else if (role === "client_admin") {
      permissions = ["read:telemetry", "read:projects", "write:projects", "read:ai-operations", "write:ai-operations", "read:documents", "write:documents", "write:support"];
    }

    const newUser: MockUserDbEntry = {
      id: getNextUserId(),
      name: name.trim(),
      email: normalizedEmail,
      role: role as any,
      clientAssociation: clientAssociation || "GFF AI Platform Core (Global Root)",
      status: status === "inactive" ? "inactive" : "active",
      clearance: clearance || (role === "gff_admin" ? "CLEARANCE LEVEL V (SECURE PLATFORM SUPERUSER)" : "CLEARANCE LEVEL I (BASIC VIEW-ONLY)"),
      permissions,
      passwordHash: hashPassword(password)
    };

    (API_MOCK_USERS as Record<string, MockUserDbEntry>)[normalizedEmail] = newUser;
    const { passwordHash: _, ...userRes } = newUser;
    return NextResponse.json({ success: true, user: userRes }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}