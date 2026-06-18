import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  fullName?: string;
  fullNameDetail?: string;
  company?: string;
  companyDetail?: string;
  businessEmail?: string;
  businessEmailDetail?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(payload: Required<ContactPayload> & { submittedAt: string }) {
  const rows = [
    ["Full Name", payload.fullName],
    ["Enter your full name", payload.fullNameDetail],
    ["Company / Organization", payload.company],
    ["Enter company name", payload.companyDetail],
    ["Business Email", payload.businessEmail],
    ["Enter official email address", payload.businessEmailDetail],
  ];

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:680px;margin:0 auto;padding:24px 12px;">
        <div style="background:linear-gradient(135deg,#050816 0%,#0b1220 100%);border-radius:20px;overflow:hidden;border:1px solid rgba(120,167,255,0.16);box-shadow:0 12px 40px rgba(2,6,23,0.22);">
          <div style="padding:28px 28px 22px;background:linear-gradient(90deg,#E4000F 0%,#009DFF 100%);color:#ffffff;">
            <div style="font-size:12px;line-height:1.4;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;opacity:0.92;">
              GFF AI
            </div>
            <div style="margin-top:10px;font-size:26px;line-height:1.15;font-weight:700;">
              New Contact Form Submission
            </div>
            <div style="margin-top:10px;font-size:14px;line-height:1.6;opacity:0.95;">
              A new visitor has submitted the website contact form.
            </div>
          </div>

          <div style="padding:28px;">
            <div style="margin-bottom:18px;padding:16px 18px;border-radius:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#e5eefc;">
              <div style="font-size:12px;line-height:1.5;letter-spacing:0.12em;text-transform:uppercase;color:#7ea6ff;font-weight:700;">
                Submission details
              </div>
              <div style="margin-top:8px;font-size:14px;line-height:1.7;">
                Submitted at ${escapeHtml(payload.submittedAt)}
              </div>
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              ${rows
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);vertical-align:top;">
                    <div style="font-size:12px;line-height:1.4;text-transform:uppercase;letter-spacing:0.08em;color:#7d8aa7;font-weight:700;">
                      ${escapeHtml(label)}
                    </div>
                    <div style="margin-top:5px;font-size:15px;line-height:1.7;color:#ffffff;font-weight:600;word-break:break-word;">
                      ${value}
                    </div>
                  </td>
                </tr>`,
                )
                .join("")}
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const fullName = body.fullName?.trim() ?? "";
    const fullNameDetail = body.fullNameDetail?.trim() ?? "";
    const company = body.company?.trim() ?? "";
    const companyDetail = body.companyDetail?.trim() ?? "";
    const businessEmail = body.businessEmail?.trim() ?? "";
    const businessEmailDetail = body.businessEmailDetail?.trim() ?? "";

    if (
      !fullName ||
      !fullNameDetail ||
      !company ||
      !companyDetail ||
      !businessEmail ||
      !businessEmailDetail
    ) {
      return NextResponse.json(
        { success: false, message: "All form fields are required." },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL ?? "ceohirezapp@gmail.com";

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      return NextResponse.json(
        { success: false, message: "Mail service is not configured." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const submittedAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata",
    });

    const subject = `New Contact Form Submission - ${fullName}`;
    const html = buildEmailHtml({
      fullName: escapeHtml(fullName),
      fullNameDetail: escapeHtml(fullNameDetail),
      company: escapeHtml(company),
      companyDetail: escapeHtml(companyDetail),
      businessEmail: escapeHtml(businessEmail),
      businessEmailDetail: escapeHtml(businessEmailDetail),
      submittedAt: escapeHtml(submittedAt),
    });

    const text = [
      "New Contact Form Submission",
      "",
      `Full Name: ${fullName}`,
      `Enter your full name: ${fullNameDetail}`,
      `Company / Organization: ${company}`,
      `Enter company name: ${companyDetail}`,
      `Business Email: ${businessEmail}`,
      `Enter official email address: ${businessEmailDetail}`,
      `Submitted at: ${submittedAt}`,
    ].join("\n");

    await transporter.sendMail({
      from: `GFF AI <${smtpUser}>`,
      to: recipientEmail,
      replyTo: businessEmail,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 },
    );
  }
}
