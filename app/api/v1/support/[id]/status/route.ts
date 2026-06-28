import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_SUPPORT_TICKETS, 
  verifyJwt, 
  MockUserDbEntry, 
  getClientIdFromAssociation 
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
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find((t: any) => t.id.toLowerCase() === key);
    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const isAdminOrSupport = caller.role === "gff_admin";

    if (!isAdminOrSupport) {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (ticket.client_id !== cid) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "You do not have permission to modify this ticket." }, { status: 403 });
      }
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.status) {
      return NextResponse.json({ success: false, error: "Bad Request", message: "Status is required." }, { status: 400 });
    }

    ticket.status = body.status;
    API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
