import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { signJwt } from "@/lib/api-auth";
import { getUserFromDynamoDB, mapDynamoUserToApiUser } from "@/lib/dynamodb-client";

export const runtime = "nodejs";

type OtpEntry = {
  code: string;
  expiresAt: number;
};

function getOtpStore(): Record<string, OtpEntry> {
  if (!(global as any)._gffAuthOtpStore) {
    (global as any)._gffAuthOtpStore = {};
  }
  return (global as any)._gffAuthOtpStore;
}

async function getAuthUser(email: string) {
  const dynamoUser = await getUserFromDynamoDB(email);
  return dynamoUser ? mapDynamoUserToApiUser(dynamoUser) : null;
}

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    }

    const action = body.action;
    const email = String(body.email || "").toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const user = await getAuthUser(email);
    if (!user) {
      return NextResponse.json({ success: false, message: "No account found for this email." }, { status: 404 });
    }
    if (user.status === "inactive") {
      return NextResponse.json({ success: false, message: "This account is inactive." }, { status: 403 });
    }

    const otpStore = getOtpStore();

    if (action === "send") {
      const transporter = getTransporter();
      if (!transporter) {
        return NextResponse.json({ success: false, message: "Mail service is not configured." }, { status: 500 });
      }

      const code = String(Math.floor(100000 + Math.random() * 900000));
      otpStore[email] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      await transporter.sendMail({
        from: `GFF AI <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your GFF AI sign-in code",
        text: `Your sign-in code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your GFF AI sign-in code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
      });

      return NextResponse.json({ success: true, message: "A sign-in code has been sent to your email." });
    }

    if (action === "verify") {
      const code = String(body.code || "").trim();
      const entry = otpStore[email];
      if (!entry || entry.expiresAt < Date.now()) {
        delete otpStore[email];
        return NextResponse.json({ success: false, message: "This code has expired. Please request a new one." }, { status: 400 });
      }
      if (entry.code !== code) {
        return NextResponse.json({ success: false, message: "The code you entered is not correct." }, { status: 401 });
      }

      delete otpStore[email];
      const accessToken = signJwt({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        clearance: user.clearance,
        clientAssociation: user.clientAssociation,
      });

      return NextResponse.json({
        success: true,
        accessToken,
        tokenType: "Bearer",
        expiresIn: 3600,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid OTP action." }, { status: 400 });
  } catch (error) {
    console.error("OTP auth error:", error);
    return NextResponse.json({ success: false, message: "Unable to process OTP right now." }, { status: 500 });
  }
}
