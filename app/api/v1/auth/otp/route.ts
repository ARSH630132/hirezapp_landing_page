import { NextResponse } from "next/server";
import { signJwt } from "@/lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser } from "@/lib/dynamodb-client";

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

    const email = String(body.email || "").toLowerCase().trim();
    const code = String(body.code || "").trim();
console.log("OTP RAW BODY:", body);
console.log("OTP NORMALIZED EMAIL:", email);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Email is required." },
        { status: 400 }
      );
    }

    if (code !== "123456") {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Invalid verification PIN." },
        { status: 401 }
      );
    }

    const dynamoUser = await getUserFromDynamoDB(email);
if (!dynamoUser) {
  console.log("OTP EMAIL NOT FOUND:", email);

  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
      message: `No account found for this email: ${email}`,
    },
    { status: 404 }
  );
}

    const userResponse = mapDynamoUserToApiUser(dynamoUser);

    if (userResponse.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "This account is inactive. Please contact your platform administrator." },
        { status: 403 }
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
    console.error("OTP auth error:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: "Unable to process OTP right now." },
      { status: 500 }
    );
  }
}