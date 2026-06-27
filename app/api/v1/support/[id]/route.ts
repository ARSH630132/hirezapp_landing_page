import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_SUPPORT_TICKETS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiSupportTicket, 
  getClientIdFromAssociation 
} from "../../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  return (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()] || null;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);

    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (ticket.client_id !== cid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const ticketWithReplies = { ...ticket } as any;
    if (ticket.wireFeed && !ticketWithReplies.replies) {
      ticketWithReplies.replies = ticket.wireFeed.map(w => ({
        sender: w.senderName,
        text: w.text,
        timestamp: w.timestamp.includes("Z") || w.timestamp.includes("-") ? w.timestamp : new Date().toISOString()
      }));
    }

    return NextResponse.json({ success: true, ticket: ticketWithReplies });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);

    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (ticket.client_id !== cid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { text, replyText } = body;
    const finalComment = text || replyText;

    if (!finalComment?.trim()) {
      return NextResponse.json({ success: false, error: "Validation Error", message: "Comment is required." }, { status: 400 });
    }

    const timestampStr = new Date().toISOString();
    const wireFeedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!ticket.wireFeed) ticket.wireFeed = [];
    const ticketAny = ticket as any;
    if (!ticketAny.replies) {
      ticketAny.replies = ticket.wireFeed.map(w => ({
        sender: w.senderName,
        text: w.text,
        timestamp: timestampStr
      }));
    }

    ticket.wireFeed.push({
      id: `w-${Date.now()}`,
      sender: "client",
      senderName: caller.name,
      text: finalComment,
      timestamp: wireFeedTime
    });

    ticketAny.replies.push({
      sender: `${caller.name} (Client)`,
      text: finalComment,
      timestamp: timestampStr
    });

    if (ticket.status === "OPEN" || ticket.status === "RESOLVED") {
      ticket.status = "IN_PROGRESS";
    }

    let botSender = "GFF Support Sentinel";
    let botText = "Handshake acknowledged. Our on-call systems engineers are reviewing your trace reports inside the secure sandbox.";

    const category = (ticket.category || "").toLowerCase();
    if (category.includes("ai") || category.includes("model")) {
      botSender = "Dr. Sarah Vance (Lead Systems Architect)";
      botText = "Analyzing enclave CPU and HSM logs. The cryptographic state is re-asserted and key rotational interlocks are operating nominally. All propagation latency is mitigated (<0.4ms).";
    } else if (category.includes("bill") || category.includes("finance")) {
      botSender = "Nicolette Durand (Billing & Treasury)";
      botText = "Invoices check completed. Invoice settlement is verified at blockchain epoch block 18290192 under seal 0xDE897FFA.";
    } else if (category.includes("govern") || category.includes("doc") || category.includes("audit") || category.includes("compl")) {
      botSender = "Sovereign Audit Agent";
      botText = "Operator credentials verified at Clearance Level IV. The NIST AI RMF logs are compiled successfully within SGX memory. Access credentials issued.";
    }

    ticket.wireFeed.push({
      id: `w-${Date.now() + 1}`,
      sender: "agent",
      senderName: botSender,
      text: botText,
      timestamp: wireFeedTime
    });

    ticketAny.replies.push({
      sender: botSender,
      text: botText,
      timestamp: timestampStr
    });

    API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;

    return NextResponse.json({ success: true, ticket: ticketAny });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
