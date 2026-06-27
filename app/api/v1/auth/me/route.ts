import { NextResponse } from "next/server";
import { API_MOCK_USERS, verifyJwt } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Missing or malformed Authorization header." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyJwt(token);

    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Invalid or expired access token." },
        { status: 401 }
      );
    }

    const email = decoded.email.toLowerCase().trim();
    const user = API_MOCK_USERS[email];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "User not found." },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "This account is inactive." },
        { status: 403 }
      );
    }

    const { passwordHash, ...userResponse } = user;

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
