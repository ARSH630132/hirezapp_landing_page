import { NextResponse } from "next/server";
import { signJwt } from "@/lib/api-auth";
import { getUserFromDynamoDB, verifyDbUserPassword, mapDynamoUserToApiUser } from "@/lib/dynamodb-client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Email and password are required fields." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    const dynamoUser = await getUserFromDynamoDB(normalizedEmail);
    if (!dynamoUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Invalid credentials provided." },
        { status: 401 }
      );
    }

    const userResponse = mapDynamoUserToApiUser(dynamoUser);
    const isInactive = userResponse.status === "inactive";
    const isValidPassword = verifyDbUserPassword(dynamoUser, password);

    if (isInactive) {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "This account is inactive. Please contact your platform administrator." },
        { status: 403 }
      );
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Invalid credentials provided." },
        { status: 401 }
      );
    }

    const tokenPayload = {
      sub: userResponse.id,
      email: userResponse.email,
        role: userResponse.role,
        name: userResponse.name,
        clearance: userResponse.clearance,
        clientAssociation: userResponse.clientAssociation,
      };

    const accessToken = signJwt(tokenPayload);

    return NextResponse.json(
      {
        success: true,
        accessToken,
        tokenType: "Bearer",
        expiresIn: 3600,
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
