import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyUserPassword, signJwt } from "@/lib/api-auth";

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
    const user = API_MOCK_USERS[normalizedEmail];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Invalid credentials provided." },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "This account is inactive. Please contact your platform administrator." },
        { status: 403 }
      );
    }

    const isValidPassword = verifyUserPassword(normalizedEmail, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Invalid credentials provided." },
        { status: 401 }
      );
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      clearance: user.clearance,
    };

    const accessToken = signJwt(tokenPayload);

    // Exclude passwordHash from user info returned
    const { passwordHash, ...userResponse } = user;

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
