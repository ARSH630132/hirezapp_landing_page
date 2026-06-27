/* eslint-disable */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-project-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/projects/route.ts app/api/v1/projects/[id]/route.ts --outDir temp-project-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
  console.log("✔ Compile success.");
} catch (e) {
  process.exit(1);
}
const apiAuth = require('../temp-project-build/lib/api-auth.js');
const prRoute = require('../temp-project-build/app/api/v1/projects/route.js');
const pidRoute = require('../temp-project-build/app/api/v1/projects/[id]/route.js');
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
    // Auth guards
    let res = await prRoute.GET(new Request("http://l/api/v1/projects", { headers: { "Authorization": inactive } }));
    if (res.status !== 403) throw new Error("Inactive user must be 403");
    res = await prRoute.GET(new Request("http://l/api/v1/projects"));
    if (res.status !== 401) throw new Error("No token must be 401");
    // GET lists & filtering
    res = await prRoute.GET(new Request("http://l/api/v1/projects", { headers: { "Authorization": admin } }));
    let d = await res.json();
    if (res.status !== 200 || d.projects.length < 5) throw new Error("Admin list failed");
    res = await prRoute.GET(new Request("http://l/api/v1/projects", { headers: { "Authorization": member } }));
    d = await res.json();
    if (d.projects.some(p => p.client_id !== "client-004")) throw new Error("Client list leakage");
    res = await prRoute.GET(new Request("http://l/api/v1/projects?client_id=client-001", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.projects.some(p => p.client_id !== "client-001")) throw new Error("Admin client filter failed");
    res = await prRoute.GET(new Request("http://l/api/v1/projects?search=Multi-Agent", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.projects.length !== 1 || !d.projects[0].name.includes("Multi-Agent")) throw new Error("Search filter failed");
    // GET single
    res = await pidRoute.GET(new Request("http://l/api/v1/projects/proj-001", { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: "proj-001" }) });
    d = await res.json();
    if (res.status !== 200 || d.project.id !== "proj-001") throw new Error("GET single failed");
    res = await pidRoute.GET(new Request("http://l/api/v1/projects/proj-004", { headers: { "Authorization": client } }), { params: Promise.resolve({ id: "proj-004" }) });
    if (res.status !== 403) throw new Error("Cross-tenant GET must be 403");
    // POST create
    const pData = { name: "Test Enclave", client_id: "client-002", desc: "Test" };
    res = await prRoute.POST(new Request("http://l/api/v1/projects", { method: "POST", headers: { "Authorization": client }, body: JSON.stringify(pData) }));
    if (res.status !== 403) throw new Error("Client POST must be 403");
    res = await prRoute.POST(new Request("http://l/api/v1/projects", { method: "POST", headers: { "Authorization": admin }, body: JSON.stringify(pData) }));
    if (res.status !== 201) throw new Error("POST failed");
    d = await res.json();
    const createdId = d.project.id;
    if (d.project.client_name !== "Global Retail Enclave [Preview Client]") throw new Error("Client mapping failed");
    // PATCH update
    res = await pidRoute.PATCH(new Request("http://l/api/v1/projects/" + createdId, { method: "PATCH", headers: { "Authorization": client }, body: JSON.stringify({ name: "Hacked" }) }), { params: Promise.resolve({ id: createdId }) });
    if (res.status !== 403) throw new Error("Client PATCH must be 403");
    res = await pidRoute.PATCH(new Request("http://l/api/v1/projects/" + createdId, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ name: "Updated Name", nodesCount: 42 }) }), { params: Promise.resolve({ id: createdId }) });
    d = await res.json();
    if (res.status !== 200 || d.project.name !== "Updated Name" || d.project.nodesCount !== 42) throw new Error("PATCH failed");
    // DELETE
    res = await pidRoute.DELETE(new Request("http://l/api/v1/projects/" + createdId, { method: "DELETE", headers: { "Authorization": client } }), { params: Promise.resolve({ id: createdId }) });
    if (res.status !== 403) throw new Error("Client DELETE must be 403");
    res = await pidRoute.DELETE(new Request("http://l/api/v1/projects/" + createdId, { method: "DELETE", headers: { "Authorization": admin } }), { params: Promise.resolve({ id: createdId }) });
    if (res.status !== 200) throw new Error("DELETE failed");
    res = await pidRoute.GET(new Request("http://l/api/v1/projects/" + createdId, { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: createdId }) });
    if (res.status !== 404) throw new Error("Lookup must return 404");
    console.log("\x1b[32m✔ VERIFICATION SUCCESSFUL: Projects CRUD APIs Verified!\x1b[0m");
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m✖ Test failed:\x1b[0m", err.stack || err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
