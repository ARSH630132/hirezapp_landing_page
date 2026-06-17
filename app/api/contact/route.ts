import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      fullName,
      fullNameDetail,
      company,
      companyDetail,
      businessEmail,
      businessEmailDetail,
    } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Full Name Detail:</strong> ${fullNameDetail}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Company Detail:</strong> ${companyDetail}</p>
        <p><strong>Email:</strong> ${businessEmail}</p>
        <p><strong>Email Detail:</strong> ${businessEmailDetail}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}