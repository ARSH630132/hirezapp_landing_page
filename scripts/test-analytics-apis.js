/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-analytics-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/analytics/client/route.ts app/api/v1/analytics/admin/route.ts --outDir temp-analytics-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
} catch (e) {
  console.error("✖ Compilation failed:", e.message);
  process.exit(1);
}
const apiAuth = require('../temp-analytics-build/lib/api-auth.js');
const clientRoute = require('../temp-analytics-build/app/api/v1/analytics/client/route.js');
const adminRoute = require('../temp-analytics-build/app/api/v1/analytics/admin/route.js');
function getAuth(email) {
  const u = apiAuth.API_MOCK_USERS[email];
  return `Bearer ${apiAuth.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}
let exitCode = 0;
async function run() {
  try {
    const admin = getAuth("s.vance@governance.gff.ai");
    const client = getAuth("a.mercer@apex-sovereign.gff.ai");
    const member = getAuth("s.jenkins@fed-treasury.gff.ai");
    const inactive = getAuth("m.vance@sovereign-logistics.gff.ai");
    let res = await clientRoute.GET(new Request("http://l/api/v1/analytics/client", { headers: { "Authorization": inactive } }));
    if (res.status !== 403) throw new Error("Inactive user must return 403");
    res = await clientRoute.GET(new Request("http://l/api/v1/analytics/client"));
    if (res.status !== 401) throw new Error("Request without auth token must return 401");
    res = await clientRoute.GET(new Request("http://l/api/v1/analytics/client", { headers: { "Authorization": client } }));
    if (res.status !== 200) throw new Error("Client analytics GET failed");
    let d = await res.json();
    if (!d.success || d.client_id !== "client-001") throw new Error("Client ID mismatch");
    const summary = d.summary;
    if (!summary.projects?.byStatus || !summary.projects?.byPhase) throw new Error("Projects aggregates missing");
    if (!summary.aiOperations?.byStatus || !summary.aiOperations?.byHealth) throw new Error("AI Operations aggregates missing");
    if (!summary.documents?.byStatus) throw new Error("Documents aggregates missing");
    if (!summary.invoices?.byStatus) throw new Error("Invoices aggregates missing");
    if (!summary.support?.byStatus || !summary.support?.byPriority) throw new Error("Support aggregates missing");
    if (!summary.governance?.byStatus || !summary.governance?.bySeverity) throw new Error("Governance aggregates missing");
    console.log("✔ Client (client-001) projects summary:", JSON.stringify(summary.projects));
    res = await clientRoute.GET(new Request("http://l/api/v1/analytics/client", { headers: { "Authorization": member } }));
    d = await res.json();
    if (d.client_id !== "client-004") throw new Error("Client member ID mismatch");
    res = await clientRoute.GET(new Request("http://l/api/v1/analytics/client?client_id=client-004", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Cross-tenant client analytics access must return 403");
    res = await clientRoute.GET(new Request("http://l/api/v1/analytics/client?client_id=client-004", { headers: { "Authorization": admin } }));
    if (res.status !== 200) throw new Error("Admin fetching client analytics failed");
    d = await res.json();
    if (d.client_id !== "client-004") throw new Error("Admin fetching client analytics client_id mismatch");
    res = await adminRoute.GET(new Request("http://l/api/v1/analytics/admin", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Non-admin accessing admin analytics must return 403");
    res = await adminRoute.GET(new Request("http://l/api/v1/analytics/admin", { headers: { "Authorization": admin } }));
    if (res.status !== 200) throw new Error("Admin analytics GET failed");
    d = await res.json();
    if (!d.success) throw new Error("Response success must be true");
    const adminSum = d.summary;
    if (adminSum.projects.totalCount < 5) throw new Error("Global projects count should be at least 5");
    if (!adminSum.projects.byStatus.active) throw new Error("Projects status 'active' count missing");
    if (!adminSum.support.byPriority.P1) throw new Error("Support priority 'P1' count missing");
    if (!adminSum.governance.bySeverity.Critical) throw new Error("Governance severity 'Critical' count missing");
    console.log("✔ Admin summary projects:", adminSum.projects.totalCount, "Invoices:", JSON.stringify(adminSum.invoices.byStatus));
    console.log("\x1b[32m✔ ALL ANALYTICS SUMMARY API TESTS PASSED SUCCESSFULLY!\x1b[0m");
  } catch (err) {
    console.error("\x1b[31m✖ Test failed:\x1b[0m", err.stack || err.message);
    exitCode = 1;
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
  process.exit(exitCode);
}
run();
