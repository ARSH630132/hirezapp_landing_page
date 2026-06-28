import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_SUPPORT_TICKETS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiSupportTicket, 
  getClientIdFromAssociation 
} from "../../../../../lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser, dynamoDbListPortalItems, dynamoDbPutPortalItem, dynamoDbDeletePortalItem } from "../../../../../lib/dynamodb-client";

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
  return (API_MOCK_USERS as Record<string, MockUserDbEntry>)[email] || null;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const dbItems = await dynamoDbListPortalItems("SUPPORT");
    let ticket = dbItems.find(t => t.id.toLowerCase() === key);

    if (!ticket) {
      ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
    }

    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const isAdminOrSupport = caller.role === "gff_admin";

    if (!isAdminOrSupport) {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (ticket.client_id !== cid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const ticketWithReplies = { ...ticket } as any;
    if (ticket.wireFeed && !ticketWithReplies.replies) {
      ticketWithReplies.replies = ticket.wireFeed.map((w: any) => ({
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

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const dbItems = await dynamoDbListPortalItems("SUPPORT");
    let ticket = dbItems.find(t => t.id.toLowerCase() === key);
    let isDynamo = !!ticket;

    if (!ticket) {
      ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
    }

    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    const isAdminOrSupport = caller.role === "gff_admin";

    if (!isAdminOrSupport) {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (ticket.client_id !== cid) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "You do not have permission to modify this ticket." }, { status: 403 });
      }
    }

    const body = await req.json();
    const { title, subject, description, desc, category, priority, status, client_id, project_id, linkedProjectId, assigned_to, assignedAgent, created_by } = body;

    if (subject !== undefined || title !== undefined) {
      const finalSubject = subject !== undefined ? subject : title;
      ticket.subject = finalSubject;
      (ticket as any).title = finalSubject;
    }
    if (description !== undefined || desc !== undefined) {
      const finalDesc = description !== undefined ? description : desc;
      ticket.description = finalDesc;
      (ticket as any).desc = finalDesc;
    }
    if (category !== undefined) {
      ticket.category = category;
    }
    if (priority !== undefined) {
      const finalPriority = (priority === "critical" || priority === "high" || priority === "P1" ? "P1" : priority === "medium" || priority === "P2" ? "P2" : "P3");
      ticket.priority = finalPriority;
    }
    if (status !== undefined) {
      ticket.status = status;
    }
    if (client_id !== undefined) {
      if (!isAdminOrSupport) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "Client roles cannot update client_id." }, { status: 403 });
      }
      ticket.client_id = client_id;
    }
    if (project_id !== undefined || linkedProjectId !== undefined) {
      const finalProjId = project_id !== undefined ? project_id : linkedProjectId;
      ticket.linkedProjectId = finalProjId;
      (ticket as any).project_id = finalProjId;
    }
    if (assigned_to !== undefined || assignedAgent !== undefined) {
      if (!isAdminOrSupport) {
        return NextResponse.json({ success: false, error: "Forbidden", message: "Client roles cannot assign tickets." }, { status: 403 });
      }
      const finalAgent = assigned_to !== undefined ? assigned_to : assignedAgent;
      ticket.assignedAgent = finalAgent;
      (ticket as any).assigned_to = finalAgent;
    }
    if (created_by !== undefined) {
      (ticket as any).created_by = created_by;
    }

    API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()] = ticket;

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbPutPortalItem("SUPPORT", ticket.client_id, ticket);
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const dbItems = await dynamoDbListPortalItems("SUPPORT");
    let ticket = dbItems.find(t => t.id.toLowerCase() === key);
    let isDynamo = !!ticket;

    if (!ticket) {
      ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
    }

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
      ticketAny.replies = ticket.wireFeed.map((w: any) => ({
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

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbPutPortalItem("SUPPORT", ticket.client_id, ticket);
    }

    return NextResponse.json({ success: true, ticket: ticketAny });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const caller = await getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const isAdmin = caller.role === "gff_admin" || caller.role === "admin";
    if (!isAdmin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const key = id.toLowerCase();
    const dbItems = await dynamoDbListPortalItems("SUPPORT");
    let ticket = dbItems.find(t => t.id.toLowerCase() === key);
    let isDynamo = !!ticket;

    if (!ticket) {
      ticket = API_MOCK_SUPPORT_TICKETS[key] || Object.values(API_MOCK_SUPPORT_TICKETS).find(t => t.id.toLowerCase() === key);
    }

    if (!ticket) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    if (isDynamo || dbItems.length > 0) {
      await dynamoDbDeletePortalItem("SUPPORT", ticket.client_id, ticket.id);
    }
    delete API_MOCK_SUPPORT_TICKETS[ticket.id.toLowerCase()];
    if (API_MOCK_SUPPORT_TICKETS[key]) {
      delete API_MOCK_SUPPORT_TICKETS[key];
    }
    return NextResponse.json({ success: true, message: "Support ticket deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
