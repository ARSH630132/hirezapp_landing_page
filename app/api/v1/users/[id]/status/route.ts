import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyJwt, MockUserDbEntry } from "../../../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  return user && user.status !== "inactive" ? user : null;
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (caller.role !== "gff_admin") {
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can change user status." }, { status: 403 });
    }

    const { id } = await params;
    const entry = (Object.entries(API_MOCK_USERS) as [string, MockUserDbEntry][]).find(([_, u]) => u.id === id);
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
    const { passwordHash, ...userRes } = user;

    return NextResponse.json({ success: true, user: userRes });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}