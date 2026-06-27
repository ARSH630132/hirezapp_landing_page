/* eslint-disable */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-dashboard-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/dashboard/client/route.ts app/api/v1/dashboard/admin/route.ts --outDir temp-dashboard-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
  console.log("✔ Compile success.");
} catch (e) {
  console.error("✖ Compilation failed:", e.message);
  process.exit(1);
}

const apiAuth = require('../temp-dashboard-build/lib/api-auth.js');
const clientRoute = require('../temp-dashboard-build/app/api/v1/dashboard/client/route.js');
const adminRoute = require('../temp-dashboard-build/app/api/v1/dashboard/admin/route.js');

function getAuth(email) {
  const u = apiAuth.API_MOCK_USERS[email];
  return `Bearer ${apiAuth.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}

async function run() {
  try {
    const admin = getAuth("s.vance@governance.gff.ai");
    const client = getAuth("a.mercer@apex-sovereign.gff.ai");
    const member = getAuth("s.jenkins@fed-treasury.gff.ai");
    const inactive = getAuth("m.vance@sovereign-logistics.gff.ai");

    // --- TEST CLIENT DASHBOARD ---
    console.log("\nTesting Client Dashboard Summary API...");

    // Auth validation
    let res = await clientRoute.GET(new Request("http://l/api/v1/dashboard/client", { headers: { "Authorization": inactive } }));
    if (res.status !== 403) throw new Error("Inactive user must be 403");

    res = await clientRoute.GET(new Request("http://l/api/v1/dashboard/client"));
    if (res.status !== 401) throw new Error("No token must be 401");

    // Client Mercer GET (client-001)
    res = await clientRoute.GET(new Request("http://l/api/v1/dashboard/client", { headers: { "Authorization": client } }));
    if (res.status !== 200) throw new Error("Client dashboard GET failed");
    let d = await res.json();
    if (!d.success) throw new Error("Response success must be true");
    if (d.client_id !== "client-001") throw new Error("Client ID mismatch");
    
    // Check client-001 summary metrics
    if (typeof d.summary.projects.activeCount !== "number" || typeof d.summary.projects.totalCount !== "number") {
      throw new Error("Summary fields missing or malformed");
    }
    console.log("✔ Client (client-001) summary details: " + JSON.stringify(d.summary.projects));

    // Client Member GET (client-004)
    res = await clientRoute.GET(new Request("http://l/api/v1/dashboard/client", { headers: { "Authorization": member } }));
    d = await res.json();
    if (d.client_id !== "client-004") throw new Error("Client member ID mismatch");

    // Client Cross-tenant check (client trying to request client-004)
    res = await clientRoute.GET(new Request("http://l/api/v1/dashboard/client?client_id=client-004", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Cross-tenant client dashboard GET must be 403");

    // Admin calling client dashboard for client-004
    res = await clientRoute.GET(new Request("http://l/api/v1/dashboard/client?client_id=client-004", { headers: { "Authorization": admin } }));
    if (res.status !== 200) throw new Error("Admin fetching client dashboard failed");
    d = await res.json();
    if (d.client_id !== "client-004") throw new Error("Admin fetching client dashboard client_id mismatch");

    // --- TEST ADMIN DASHBOARD ---
    console.log("\nTesting Admin Dashboard Summary API...");

    // RBAC validation
    res = await adminRoute.GET(new Request("http://l/api/v1/dashboard/admin", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Non-admin accessing admin dashboard must be 403");

    // Admin GET global summary
    res = await adminRoute.GET(new Request("http://l/api/v1/dashboard/admin", { headers: { "Authorization": admin } }));
    if (res.status !== 200) throw new Error("Admin dashboard GET failed");
    d = await res.json();
    if (!d.success) throw new Error("Response success must be true");
    
    // Verify admin summary aggregates
    if (d.summary.clients.totalCount !== 4) throw new Error("Total clients aggregate must be 4");
    if (typeof d.summary.projects.totalCount !== "number" || typeof d.summary.aiOperations.totalCount !== "number") {
      throw new Error("Admin projects/operations counts missing");
    }
    if (d.summary.projects.totalCount < 5) throw new Error("Global projects count should be at least 5");
    if (d.summary.documents.totalCount < 4) throw new Error("Global documents count should be at least 4");
    if (d.summary.support.totalCount < 3) throw new Error("Global support count should be at least 3");

    console.log("✔ Admin summary details - Clients: " + d.summary.clients.totalCount + ", Projects: " + d.summary.projects.totalCount + ", Operations: " + d.summary.aiOperations.totalCount);

    console.log("\n\x1b[32m✔ ALL DASHBOARD SUMMARY API TESTS PASSED SUCCESSFULLY!\x1b[0m");
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m✖ Test failed:\x1b[0m", err.stack || err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
