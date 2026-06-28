import { NextResponse } from "next/server";
import { getNextUserId, hashPassword } from "@/lib/api-auth";
import { dynamoDbGetClient, dynamoDbListClients, getUserFromDynamoDB, putUserInDynamoDB } from "@/lib/dynamodb-client";

export const runtime = "nodejs";

export async function GET() {
  try {
    const clients = await dynamoDbListClients();
    return NextResponse.json({
      success: true,
      clients: clients.map((client: any) => ({
        id: String(client.client_id || client.id || ""),
        name: client.name || client.company_name || `Client ${client.client_id || client.id || ""}`,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to load clients right now." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 },
      );
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const role = body.role === "client_admin" ? "client_admin" : "client_member";
    const clientId = String(body.client_id || "").trim();

    if (!name || !email || !password || password.length < 8 || !clientId) {
      return NextResponse.json(
        { success: false, message: "Name, email, password, and client are required." },
        { status: 400 },
      );
    }

    if (await getUserFromDynamoDB(email)) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const client = await dynamoDbGetClient(clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, message: "Please choose a valid client." },
        { status: 400 },
      );
    }

    const userId = getNextUserId();
    const passwordHash = hashPassword(password);
    await putUserInDynamoDB({
      email,
      hashed_password: passwordHash,
      full_name: name,
      name,
      role,
      status: "active",
      client_id: clientId,
      clientAssociation: client.name || client.company_name || `client-${String(clientId).padStart(3, "0")}`,
      is_active: true,
      id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. You can sign in now.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create account right now." },
      { status: 500 },
    );
  }
}
