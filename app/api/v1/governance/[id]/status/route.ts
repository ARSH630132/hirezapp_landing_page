import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, API_MOCK_GOVERNANCE, verifyJwt, MockUserDbEntry, ApiGovernanceItem 
} from "../../../../../../lib/api-auth";

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
      return NextResponse.json({ success: false, error: "Forbidden", message: "Only platform administrators can change item status." }, { status: 403 });
    }

    const { id } = await params;
    const item = (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id];
    if (!item) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body || !body.status) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
    }

    const { status } = body;
    if (typeof status !== "string" || !status.trim()) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Invalid status value." }, { status: 400 });
    }

    item.status = status.trim();
    item.lastUpdated = new Date().toISOString();
    
    (API_MOCK_GOVERNANCE as Record<string, ApiGovernanceItem>)[id] = item;

    return NextResponse.json({ success: true, governance: item });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
