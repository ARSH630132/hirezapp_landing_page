/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const T = path.join(__dirname, '..', 'temp-api-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });

try {
  console.log("Compiling support route files...");
  execSync('npx tsc lib/api-auth.ts app/api/v1/support/route.ts app/api/v1/support/[id]/route.ts app/api/v1/support/[id]/status/route.ts app/api/v1/support/[id]/assign/route.ts --outDir temp-api-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'inherit' });
  console.log("✔ Compile success.");
} catch (e) {
  process.exit(1);
}

const apiAuth = require('../temp-api-build/lib/api-auth.js');
const supportRoute = require('../temp-api-build/app/api/v1/support/route.js');
const supportIdRoute = require('../temp-api-build/app/api/v1/support/[id]/route.js');
const statusRoute = require('../temp-api-build/app/api/v1/support/[id]/status/route.js');
const assignRoute = require('../temp-api-build/app/api/v1/support/[id]/assign/route.js');

function getAuth(email) {
  const u = apiAuth.API_MOCK_USERS[email];
  return `Bearer ${apiAuth.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}

async function run() {
  try {
    const admin = getAuth("s.vance@governance.gff.ai");
    const client1 = getAuth("a.mercer@apex-sovereign.gff.ai"); // client-001
    const client2 = getAuth("e.carter@global-retail.gff.ai"); // client-002

    // 1. GET List (Client Scoping)
    let res = await supportRoute.GET(new Request("http://l/api/v1/support", { headers: { "Authorization": client1 } }));
    let d = await res.json();
    if (res.status !== 200 || !d.success || !d.tickets.every(t => t.client_id === "client-001")) {
      throw new Error("Client1 scoping failed");
    }

    // 2. POST Create
    res = await supportRoute.POST(new Request("http://l/api/v1/support", {
      method: "POST",
      headers: { "Authorization": client1, "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "Test Ticket", description: "Test desc", priority: "high", category: "General" })
    }));
    d = await res.json();
    if (res.status !== 201 || !d.success) throw new Error("Create support ticket failed");
    const newId = d.ticket.id;

    // 3. GET Single (Forbidden check)
    res = await supportIdRoute.GET(new Request(`http://l/api/v1/support/${newId}`, { headers: { "Authorization": client2 } }), { params: Promise.resolve({ id: newId }) });
    if (res.status !== 403) throw new Error("Expected 403 for other client retrieval");

    res = await supportIdRoute.GET(new Request(`http://l/api/v1/support/${newId}`, { headers: { "Authorization": client1 } }), { params: Promise.resolve({ id: newId }) });
    d = await res.json();
    if (res.status !== 200 || d.ticket.id !== newId) throw new Error("Get support ticket failed");

    // 4. PATCH Update
    res = await supportIdRoute.PATCH(new Request(`http://l/api/v1/support/${newId}`, {
      method: "PATCH",
      headers: { "Authorization": client1, "Content-Type": "application/json" },
      body: JSON.stringify({ description: "Updated desc" })
    }), { params: Promise.resolve({ id: newId }) });
    d = await res.json();
    if (res.status !== 200 || d.ticket.description !== "Updated desc") throw new Error("Patch ticket failed");

    // 5. POST Comment
    res = await supportIdRoute.POST(new Request(`http://l/api/v1/support/${newId}`, {
      method: "POST",
      headers: { "Authorization": client1, "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hello" })
    }), { params: Promise.resolve({ id: newId }) });
    d = await res.json();
    if (res.status !== 200 || d.ticket.replies.length < 3) throw new Error("Comment post or bot auto-reply failed");

    // 6. PATCH Status
    res = await statusRoute.PATCH(new Request(`http://l/api/v1/support/${newId}/status`, {
      method: "PATCH",
      headers: { "Authorization": admin, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESOLVED" })
    }), { params: Promise.resolve({ id: newId }) });
    d = await res.json();
    if (res.status !== 200 || d.ticket.status !== "RESOLVED") throw new Error("Patch status failed");

    // 7. PATCH Assign
    res = await assignRoute.PATCH(new Request(`http://l/api/v1/support/${newId}/assign`, {
      method: "PATCH",
      headers: { "Authorization": admin, "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to: "Dr. Sarah Vance" })
    }), { params: Promise.resolve({ id: newId }) });
    d = await res.json();
    if (res.status !== 200 || d.ticket.assignedAgent !== "Dr. Sarah Vance") throw new Error("Patch assign failed");

    // 8. DELETE Ticket
    res = await supportIdRoute.DELETE(new Request(`http://l/api/v1/support/${newId}`, {
      method: "DELETE",
      headers: { "Authorization": client1 }
    }), { params: Promise.resolve({ id: newId }) });
    if (res.status !== 403) throw new Error("Expected 403 for client ticket delete");

    res = await supportIdRoute.DELETE(new Request(`http://l/api/v1/support/${newId}`, {
      method: "DELETE",
      headers: { "Authorization": admin }
    }), { params: Promise.resolve({ id: newId }) });
    if (res.status !== 200) throw new Error("Delete ticket failed");

    console.log("\x1b[32m✔ All Support CRUD API tests passed successfully!\x1b[0m");
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m✖ Test failed:\x1b[0m", err.stack || err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
