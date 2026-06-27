import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_SUPPORT_TICKETS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiSupportTicket, 
  getClientIdFromAssociation,
  getClientNameFromId
} from "../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { status: 401, error: "Unauthorized", msg: "Missing Authorization header." };
  }
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) {
    return { status: 401, error: "Unauthorized", msg: "Invalid/expired access token." };
  }
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  if (!user) {
    return { status: 401, error: "Unauthorized", msg: "Authorized user not found." };
  }
  if (user.status === "inactive") {
    return { status: 403, error: "Forbidden", msg: "This account is inactive." };
  }
  return { caller: user };
}

export async function GET(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    const { searchParams } = new URL(req.url);
    const clientIdFilter = searchParams.get("client_id");
    const categoryFilter = searchParams.get("category");
    const priorityFilter = searchParams.get("priority");
    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    let tickets = Object.values(API_MOCK_SUPPORT_TICKETS) as ApiSupportTicket[];

    // Ensure bidirectional mapping of wireFeed and replies
    tickets = tickets.map(t => {
      const ticketWithReplies = { ...t } as any;
      if (t.wireFeed && !ticketWithReplies.replies) {
        ticketWithReplies.replies = t.wireFeed.map(w => ({
          sender: w.senderName,
          text: w.text,
          timestamp: w.timestamp.includes("Z") || w.timestamp.includes("-") ? w.timestamp : new Date().toISOString()
        }));
      }
      return ticketWithReplies;
    });

    if (caller.role !== "gff_admin") {
      const callerClientId = getClientIdFromAssociation(caller.clientAssociation);
      tickets = tickets.filter(t => t.client_id === callerClientId);

      if (clientIdFilter && clientIdFilter !== callerClientId) {
        return NextResponse.json(
          { success: false, error: "Forbidden", message: "Access denied." },
          { status: 403 }
        );
      }
    } else {
      if (clientIdFilter) {
        tickets = tickets.filter(t => t.client_id === clientIdFilter);
      }
    }

    if (categoryFilter) {
      const q = categoryFilter.toLowerCase().trim();
      tickets = tickets.filter(t => t.category.toLowerCase().includes(q));
    }
    if (priorityFilter) {
      const q = priorityFilter.toLowerCase().trim();
      tickets = tickets.filter(t => t.priority.toLowerCase() === q);
    }
    if (statusFilter) {
      const q = statusFilter.toLowerCase().trim();
      tickets = tickets.filter(t => t.status.toLowerCase() === q);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      tickets = tickets.filter(t => 
        t.subject.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) || 
        t.id.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, tickets });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = getAuthCaller(req);
    if ("status" in auth) {
      return NextResponse.json({ success: false, error: auth.error, message: auth.msg }, { status: auth.status });
    }
    const { caller } = auth;

    const body = await req.json();
    const { subject, title, description, desc, priority, category, projectId, linkedProjectId, linkedDocId } = body;

    const finalSubject = subject || title;
    const finalDescription = description || desc;

    if (!finalSubject?.trim() || !finalDescription?.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation Error", message: "Summary subject and description are required." },
        { status: 400 }
      );
    }

    const client_id = getClientIdFromAssociation(caller.clientAssociation);
    const client_name = getClientNameFromId(client_id);
    const newId = `T-${Math.floor(800 + Math.random() * 200)}`;

    const finalPriority = (priority === "critical" || priority === "high" ? "P1" : priority === "medium" ? "P2" : "P3");
    const finalCategory = category || "General";

    const timestampStr = new Date().toISOString();
    const wireFeedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTicket: any = {
      id: newId,
      subject: finalSubject,
      client_id,
      client_name,
      priority: finalPriority,
      category: finalCategory,
      status: "OPEN",
      assignedAgent: "Unassigned",
      linkedProjectId: linkedProjectId || projectId || undefined,
      linkedDocId: linkedDocId || undefined,
      slaSeconds: 14400,
      description: finalDescription,
      createdDate: timestampStr,
      wireFeed: [
        {
          id: "w1",
          sender: "client",
          senderName: caller.name,
          text: finalDescription,
          timestamp: wireFeedTime
        }
      ],
      replies: [
        {
          sender: caller.name + " (Client)",
          text: finalDescription,
          timestamp: timestampStr
        }
      ]
    };

    API_MOCK_SUPPORT_TICKETS[newId.toLowerCase()] = newTicket;

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
