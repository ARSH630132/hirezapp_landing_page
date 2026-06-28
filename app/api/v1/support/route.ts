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
    const projectIdFilter = searchParams.get("project_id") || searchParams.get("linkedProjectId");
    const assignedToFilter = searchParams.get("assigned_to") || searchParams.get("assignedAgent") || searchParams.get("assigned_agent");
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

    const isAdminOrSupport = caller.role === "gff_admin";

    if (!isAdminOrSupport) {
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
      tickets = tickets.filter(t => t.priority.toLowerCase() === q || (q === "critical" && t.priority === "P1") || (q === "high" && t.priority === "P2") || (q === "medium" && t.priority === "P3"));
    }
    if (statusFilter) {
      const q = statusFilter.toLowerCase().trim();
      tickets = tickets.filter(t => t.status.toLowerCase() === q);
    }
    if (projectIdFilter) {
      const q = projectIdFilter.toLowerCase().trim();
      tickets = tickets.filter(t => t.linkedProjectId?.toLowerCase() === q || (t as any).project_id?.toLowerCase() === q);
    }
    if (assignedToFilter) {
      const q = assignedToFilter.toLowerCase().trim();
      tickets = tickets.filter(t => t.assignedAgent?.toLowerCase() === q || (t as any).assigned_to?.toLowerCase() === q);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      tickets = tickets.filter(t => 
        t.subject.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) || 
        t.id.toLowerCase().includes(q) ||
        (t as any).title?.toLowerCase().includes(q)
      );
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset") || searchParams.get("skip");
    const limit = limitParam ? Math.max(1, Math.min(1000, parseInt(limitParam, 10) || 100)) : 100;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

    const paginatedTickets = tickets.slice(offset, offset + limit);

    return NextResponse.json({ success: true, tickets: paginatedTickets });
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
    const { subject, title, description, desc, priority, category, projectId, linkedProjectId, linkedDocId, client_id, assigned_to, assignedAgent, created_by } = body;

    const finalSubject = subject || title;
    const finalDescription = description || desc;

    if (!finalSubject?.trim() || !finalDescription?.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation Error", message: "Summary subject and description are required." },
        { status: 400 }
      );
    }

    const callerClientId = getClientIdFromAssociation(caller.clientAssociation);
    const isAdminOrSupport = caller.role === "gff_admin";

    if (!isAdminOrSupport) {
      if (client_id && client_id !== callerClientId) {
        return NextResponse.json(
          { success: false, error: "Forbidden", message: "You can only create tickets for your own client account." },
          { status: 403 }
        );
      }
    }

    const finalClientId = client_id || callerClientId;
    const client_name = getClientNameFromId(finalClientId);
    const newId = `T-${Math.floor(800 + Math.random() * 200)}`;

    const finalPriority = (priority === "critical" || priority === "high" || priority === "P1" ? "P1" : priority === "medium" || priority === "P2" ? "P2" : "P3");
    const finalCategory = category || "General";

    const timestampStr = new Date().toISOString();
    const wireFeedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTicket: any = {
      id: newId,
      subject: finalSubject,
      title: finalSubject,
      client_id: finalClientId,
      client_name,
      priority: finalPriority,
      category: finalCategory,
      status: body.status || "OPEN",
      assignedAgent: assigned_to || assignedAgent || "Unassigned",
      assigned_to: assigned_to || assignedAgent || "Unassigned",
      linkedProjectId: linkedProjectId || projectId || undefined,
      project_id: linkedProjectId || projectId || undefined,
      linkedDocId: linkedDocId || undefined,
      slaSeconds: 14400,
      description: finalDescription,
      desc: finalDescription,
      createdDate: timestampStr,
      created_by: created_by || caller.email || caller.name,
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
