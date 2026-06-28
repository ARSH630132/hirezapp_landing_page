import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    return NextResponse.json(
      {
        success: true,
        message: "Session terminated successfully. Token discarded.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}
