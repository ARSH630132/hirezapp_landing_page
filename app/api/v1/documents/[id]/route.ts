import { NextResponse } from "next/server";
import { 
  API_MOCK_USERS, 
  API_MOCK_DOCUMENTS, 
  verifyJwt, 
  MockUserDbEntry, 
  ApiDocumentItem, 
  getClientIdFromAssociation 
} from "../../../../../lib/api-auth";

export const runtime = "nodejs";

function getAuthCaller(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const decoded = verifyJwt(auth.substring(7));
  if (!decoded?.email) return null;
  const user = (API_MOCK_USERS as Record<string, MockUserDbEntry>)[decoded.email.toLowerCase().trim()];
  return user && user.status !== "inactive" ? user : null;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const caller = getAuthCaller(req);
    if (!caller) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    
    if (!id) return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });

    const docKey = id.toLowerCase();
    let document: ApiDocumentItem | undefined = (API_MOCK_DOCUMENTS as Record<string, ApiDocumentItem>)[docKey];
    if (!document) {
      document = Object.values(API_MOCK_DOCUMENTS).find(
        d => d.id.toLowerCase() === docKey
      );
    }

    if (!document) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    if (caller.role !== "gff_admin") {
      const cid = getClientIdFromAssociation(caller.clientAssociation);
      if (document.client_id !== cid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    
    return NextResponse.json({ success: true, document });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
