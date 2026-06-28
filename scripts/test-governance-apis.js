const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-governance-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/governance/route.ts app/api/v1/governance/[id]/route.ts app/api/v1/governance/[id]/status/route.ts --outDir temp-governance-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
} catch (e) { 
  console.error("Comp failed:", e);
  process.exit(1); 
}
const api = require('../temp-governance-build/lib/api-auth.js');
const r1 = require('../temp-governance-build/app/api/v1/governance/route.js');
const r2 = require('../temp-governance-build/app/api/v1/governance/[id]/route.js');
const r3 = require('../temp-governance-build/app/api/v1/governance/[id]/status/route.js');
const auth = (e) => {
  const u = api.API_MOCK_USERS[e];
  return `Bearer ${api.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}
async function run() {
  try {
    const admin = auth("s.vance@governance.gff.ai"), client = auth("a.mercer@apex-sovereign.gff.ai");
    let res = await r1.GET(new Request("http://l/api/v1/governance", { headers: { "Authorization": auth("m.vance@sovereign-logistics.gff.ai") } }));
    if (res.status !== 403) throw new Error("Inactive check failed");
    res = await r1.GET(new Request("http://l/api/v1/governance", { headers: { "Authorization": admin } }));
    let d = await res.json();
    if (d.governance.length < 4) throw new Error("List size check failed");
    res = await r1.GET(new Request("http://l/api/v1/governance", { headers: { "Authorization": client } }));
    d = await res.json();
    if (d.governance.some(i => i.client_id !== "client-001")) throw new Error("Tenant isolation failed");
    res = await r1.GET(new Request("http://l/api/v1/governance?client_id=client-003", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Tenant cross filter check failed");
    res = await r1.GET(new Request("http://l/api/v1/governance?search=Leakage", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.governance.length !== 1) throw new Error("Search filter failed");
    res = await r1.GET(new Request("http://l/api/v1/governance?project_id=proj-001", { headers: { "Authorization": admin } }));
    if ((await res.json()).governance.length < 1) throw new Error("Project filter failed");
    res = await r1.GET(new Request("http://l/api/v1/governance?severity=Critical", { headers: { "Authorization": admin } }));
    if ((await res.json()).governance.length < 1) throw new Error("Severity filter failed");
    res = await r1.GET(new Request("http://l/api/v1/governance?due_date=2026-07-01", { headers: { "Authorization": admin } }));
    if ((await res.json()).governance.length < 1) throw new Error("Due date filter failed");
    res = await r2.GET(new Request("http://l/api/v1/governance/gov-001", { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: "gov-001" }) });
    if ((await res.json()).governance.id !== "gov-001") throw new Error("GET single check failed");
    res = await r2.GET(new Request("http://l/api/v1/governance/gov-003", { headers: { "Authorization": client } }), { params: Promise.resolve({ id: "gov-003" }) });
    if (res.status !== 403) throw new Error("Cross GET check failed");
    const item = { title: "TEST_GOV", client_id: "client-002", description: "Test desc" };
    res = await r1.POST(new Request("http://l/api/v1/governance", { method: "POST", headers: { "Authorization": client }, body: JSON.stringify(item) }));
    if (res.status !== 403) throw new Error("Client POST write restriction failed");
    res = await r1.POST(new Request("http://l/api/v1/governance", { method: "POST", headers: { "Authorization": admin }, body: JSON.stringify(item) }));
    if (res.status !== 201) throw new Error("POST create failed: " + res.status);
    const createdItem = (await res.json()).governance;
    const cid = createdItem.id;
    if (createdItem.title !== "TEST_GOV") throw new Error("POST create returned incorrect title");
    res = await r2.PATCH(new Request("http://l/api/v1/governance/" + cid, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ description: "Updated desc" }) }), { params: Promise.resolve({ id: cid }) });
    if ((await res.json()).governance.description !== "Updated desc") throw new Error("PATCH update check failed");
    res = await r3.PATCH(new Request("http://l/api/v1/governance/" + cid + "/status", { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ status: "Remediated" }) }), { params: Promise.resolve({ id: cid }) });
    if ((await res.json()).governance.status !== "Remediated") throw new Error("PATCH status check failed");
    res = await r2.DELETE(new Request("http://l/api/v1/governance/" + cid, { method: "DELETE", headers: { "Authorization": admin } }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("DELETE check failed");
    console.log("\x1b[32m✔ VERIFICATION SUCCESSFUL: Governance CRUD APIs Verified!\x1b[0m");
  } catch (err) {
    console.error("Test failed error:", err);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
