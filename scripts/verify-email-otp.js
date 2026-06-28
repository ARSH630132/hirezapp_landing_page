/* eslint-disable */
const fs = require("fs");
const net = require("net");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MAILBOX = [];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function readJson(response) {
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch {
      return { rawText: text };
    }
  });
}

function startFakeSmtpServer() {
  const sessions = [];

  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      socket.setEncoding("utf8");
      socket.write("220 localhost ESMTP ready\r\n");

      const session = {
        auth: null,
        envelope: { from: null, to: [] },
        data: "",
        state: "command",
        buffer: "",
      };
      sessions.push(session);

      const write = (line) => socket.write(`${line}\r\n`);

      const flushData = () => {
        MAILBOX.push({
          auth: session.auth,
          envelope: session.envelope,
          raw: session.data,
        });
        session.data = "";
        session.envelope = { from: null, to: [] };
        session.state = "command";
        write("250 2.0.0 Message accepted");
      };

      const handleCommand = (line) => {
        if (session.state === "data") {
          if (line === ".") {
            flushData();
          } else {
            session.data += `${line}\n`;
          }
          return;
        }

        if (session.state === "auth-username") {
          session.auth = session.auth || {};
          session.auth.user = Buffer.from(line, "base64").toString("utf8");
          session.state = "auth-password";
          write("334 UGFzc3dvcmQ6");
          return;
        }

        if (session.state === "auth-password") {
          session.auth = session.auth || {};
          session.auth.pass = Buffer.from(line, "base64").toString("utf8");
          session.state = "command";
          write("235 2.7.0 Authentication successful");
          return;
        }

        const [command, ...rest] = line.split(" ");
        const upper = command.toUpperCase();
        const arg = rest.join(" ");

        if (upper === "EHLO") {
          write("250-localhost");
          write("250-AUTH PLAIN LOGIN");
          write("250 OK");
          return;
        }

        if (upper === "HELO") {
          write("250 localhost");
          return;
        }

        if (upper === "AUTH") {
          const mechanism = (rest[0] || "").toUpperCase();
          if (mechanism === "PLAIN") {
            if (rest[1]) {
              session.auth = {
                mechanism: "PLAIN",
                raw: Buffer.from(rest[1], "base64").toString("utf8"),
              };
              write("235 2.7.0 Authentication successful");
            } else {
              session.state = "auth-plain";
              write("334 ");
            }
            return;
          }

          if (mechanism === "LOGIN") {
            session.state = "auth-username";
            write("334 VXNlcm5hbWU6");
            return;
          }

          write("504 5.5.4 Unrecognized authentication type");
          return;
        }

        if (session.state === "auth-plain") {
          session.auth = {
            mechanism: "PLAIN",
            raw: Buffer.from(line, "base64").toString("utf8"),
          };
          session.state = "command";
          write("235 2.7.0 Authentication successful");
          return;
        }

        if (upper === "MAIL") {
          session.envelope.from = arg;
          write("250 2.1.0 OK");
          return;
        }

        if (upper === "RCPT") {
          session.envelope.to.push(arg);
          write("250 2.1.5 OK");
          return;
        }

        if (upper === "DATA") {
          session.state = "data";
          write("354 End data with <CR><LF>.<CR><LF>");
          return;
        }

        if (upper === "RSET" || upper === "NOOP") {
          write("250 OK");
          return;
        }

        if (upper === "QUIT") {
          write("221 Bye");
          socket.end();
          return;
        }

        write("250 OK");
      };

      socket.on("data", (chunk) => {
        session.buffer += chunk;
        let index;
        while ((index = session.buffer.indexOf("\n")) !== -1) {
          const line = session.buffer.slice(0, index).replace(/\r$/, "");
          session.buffer = session.buffer.slice(index + 1);
          handleCommand(line);
        }
      });

      socket.on("error", () => {});
    });

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        port: address.port,
        close: () =>
          new Promise((resolveClose) => {
            server.close(() => resolveClose());
          }),
      });
    });
  });
}

async function main() {
  console.log("========================================================");
  console.log("   Email + OTP Functional Verification Suite");
  console.log("========================================================");

  loadEnvFile(path.join(ROOT, ".env"));

  const envSummary = [
    ["SMTP_HOST", Boolean(process.env.SMTP_HOST)],
    ["SMTP_PORT", Boolean(process.env.SMTP_PORT)],
    ["SMTP_USER", Boolean(process.env.SMTP_USER)],
    ["SMTP_PASSWORD / SMTP_PASS", Boolean(process.env.SMTP_PASSWORD || process.env.SMTP_PASS)],
  ];

  console.log("\nSMTP config present in .env:");
  for (const [name, present] of envSummary) {
    console.log(`  ${present ? "✔" : "✖"} ${name}`);
  }

  assert(envSummary.every(([, present]) => present), "Missing SMTP settings in .env.");

  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
  delete process.env.AWS_SESSION_TOKEN;
  process.env.ENABLE_API_MOCKS = "true";

  const smtp = await startFakeSmtpServer();
  process.env.SMTP_HOST = "127.0.0.1";
  process.env.SMTP_PORT = String(smtp.port);
  process.env.SMTP_USER = "test-sender@example.com";
  process.env.SMTP_PASSWORD = "test-password";
  process.env.CONTACT_RECEIVER_EMAIL = "receiver@example.com";

  const mockUsers = {
    "a.mercer@apex-sovereign.gff.ai": {
      id: "usr-003",
      name: "Alexander Mercer",
      email: "a.mercer@apex-sovereign.gff.ai",
      role: "client_admin",
      clientAssociation: "Apex Sovereign Group [Preview Client]",
      status: "active",
      clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
    },
  };

  const authChunkPath = path.join(ROOT, ".next/server/chunks/Documents_GitHub_hirezapp_landing_page_06ha3fg._.js");
  const authChunk = require(authChunkPath);
  const authFactoryIndex = authChunk.findIndex((entry) => entry === 15050);
  assert(authFactoryIndex !== -1, "Could not find the compiled auth module in the runtime chunk.");
  authChunk[authFactoryIndex + 1] = (module, exports, require) => {
    const mockedUser = mockUsers["a.mercer@apex-sovereign.gff.ai"];
    module.s([
      "getUserFromDynamoDB",
      0,
      async (email) => mockUsers[email.toLowerCase().trim()] || null,
      "mapDynamoUserToApiUser",
      0,
      (dbUser) => ({
        id: String(dbUser.id || mockedUser.id),
        name: dbUser.full_name || dbUser.name || dbUser.email,
        email: String(dbUser.email || "").toLowerCase().trim(),
        role: dbUser.role || mockedUser.role,
        clientAssociation: dbUser.clientAssociation || mockedUser.clientAssociation,
        status: dbUser.status || mockedUser.status,
        clearance: dbUser.clearance || mockedUser.clearance,
        permissions: [
          "read:telemetry",
          "read:projects",
          "write:projects",
          "read:ai-operations",
          "write:ai-operations",
          "read:documents",
          "write:documents",
          "write:support",
        ],
      }),
    ]);
  };
  const otpRuntime = require(path.join(ROOT, ".next/server/chunks/[turbopack]_runtime.js"))(
    "server/app/api/v1/auth/otp/route.js",
  );
  otpRuntime.c("server/chunks/Documents_GitHub_hirezapp_landing_page_06ha3fg._.js");
  const apiAuthModule = otpRuntime.m(7852).exports;
  apiAuthModule.signJwt = (payload) => {
    const header = { alg: "HS256", typ: "JWT" };
    const body = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const base64UrlEncode = (value) =>
      Buffer.from(value)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    return [
      base64UrlEncode(JSON.stringify(header)),
      base64UrlEncode(JSON.stringify(body)),
      "mock-signature",
    ].join(".");
  };

  const otpRouteModule = require(path.join(ROOT, ".next/server/app/api/v1/auth/otp/route.js"));
  const contactRouteModule = require(path.join(ROOT, ".next/server/app/api/contact/route.js"));
  const otpRoute = otpRouteModule.routeModule.userland;
  const contactRoute = contactRouteModule.routeModule.userland;

  const tests = [];
  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  \x1b[32m✔\x1b[0m ${name}`);
      tests.push(true);
    } catch (error) {
      console.log(`  \x1b[31m✖\x1b[0m ${name}`);
      console.error(`    ${error.message}`);
      tests.push(false);
    }
  };

  let capturedOtp = null;

  console.log("\nContact route:");
  await test("sends the contact form email payload successfully", async () => {
    const response = await contactRoute.POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Alex Mercer",
          fullNameDetail: "Alex Mercer",
          company: "Apex Sovereign Group",
          companyDetail: "Apex Sovereign Group",
          businessEmail: "alex@example.com",
          businessEmailDetail: "alex@example.com",
        }),
      }),
    );
    const data = await readJson(response);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(data.success === true, "Contact route did not report success.");

    const last = MAILBOX.at(-1);
    assert(last, "Contact email was not captured by the fake SMTP server.");
    assert(String(last.raw).includes("New Contact Form Submission"), "Contact email body is missing the expected subject text.");
    assert(String(last.envelope.from).includes("test-sender@example.com"), "Contact envelope sender is wrong.");
  });

  console.log("\nOTP route:");
  await test("sends an OTP email for an active mock user", async () => {
    const response = await otpRoute.POST(
      new Request("http://localhost/api/v1/auth/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "send", email: "a.mercer@apex-sovereign.gff.ai" }),
      }),
    );
    const data = await readJson(response);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(data.success === true, "OTP send did not report success.");

    const last = MAILBOX.at(-1);
    assert(last, "OTP email was not captured by the fake SMTP server.");
    const match = `${last.raw}`.match(/\b(\d{6})\b/);
    assert(match, "Could not find a 6-digit OTP in the outgoing email.");
    capturedOtp = match[1];
  });

  await test("rejects an incorrect OTP code", async () => {
    const response = await otpRoute.POST(
      new Request("http://localhost/api/v1/auth/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify", email: "a.mercer@apex-sovereign.gff.ai", code: "000000" }),
      }),
    );
    const data = await readJson(response);
    assert(response.status === 401, `Expected 401, got ${response.status}`);
    assert(data.success === false, "Wrong code should not verify.");
  });

  await smtp.close();

  const passed = tests.filter(Boolean).length;
  const failed = tests.length - passed;

  console.log("\n========================================================");
  console.log(`   Passed: ${passed} | Failed: ${failed}`);
  console.log("========================================================");

  if (failed > 0) {
    process.exit(1);
  }

  console.log("Email sending and OTP route logic are working in the local test harness.");
  console.log("Note: OTP codes are stored in-memory, so they reset on restart or across multiple instances.");
  console.log("Note: the full OTP-success token branch still depends on the compiled runtime's JWT helper binding.");
}

main().catch(async (error) => {
  console.error("\nVerification crashed:", error);
  process.exit(1);
});
