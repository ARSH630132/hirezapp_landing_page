const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-ai-op-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/ai-operations/route.ts app/api/v1/ai-operations/[id]/route.ts --outDir temp-ai-op-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
} catch (e) {
  process.exit(1);
}
const apiAuth = require('../temp-ai-op-build/lib/api-auth.js');
const opR = require('../temp-ai-op-build/app/api/v1/ai-operations/route.js');
const opIdR = require('../temp-ai-op-build/app/api/v1/ai-operations/[id]/route.js');
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
    let r = await opR.GET(new Request("http://l/api/v1/ai-operations", { headers: { "Authorization": inactive } }));
    if (r.status !== 403) throw new Error("1");
    r = await opR.GET(new Request("http://l/api/v1/ai-operations"));
    if (r.status !== 401) throw new Error("2");
    r = await opR.GET(new Request("http://l/api/v1/ai-operations", { headers: { "Authorization": admin } }));
    let d = await r.json();
    if (r.status !== 200 || d.operations.length < 4) throw new Error("3");
    r = await opR.GET(new Request("http://l/api/v1/ai-operations", { headers: { "Authorization": member } }));
    d = await r.json();
    if (d.operations.some(o => o.client_id !== "client-004")) throw new Error("4");
    r = await opR.GET(new Request("http://l/api/v1/ai-operations?client_id=client-001&status=active&health=healthy&agent_type=autonomous&governance_status=compliant", { headers: { "Authorization": admin } }));
    d = await r.json();
    if (d.operations.some(o => o.client_id !== "client-001" || o.status !== "active")) throw new Error("5");
    r = await opR.GET(new Request("http://l/api/v1/ai-operations?project_id=proj-003", { headers: { "Authorization": admin } }));
    d = await r.json();
    if (d.operations.some(o => o.project_id !== "proj-003")) throw new Error("6");
    r = await opR.GET(new Request("http://l/api/v1/ai-operations?search=Logistics", { headers: { "Authorization": admin } }));
    d = await r.json();
    if (!d.operations[0]?.name.toLowerCase().includes("logistics")) throw new Error("7");
    r = await opIdR.GET(new Request("http://l/api/v1/ai-operations/op-001", { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: "op-001" }) });
    d = await r.json();
    if (r.status !== 200 || d.operation.id !== "op-001") throw new Error("8");
    r = await opIdR.GET(new Request("http://l/api/v1/ai-operations/op-004", { headers: { "Authorization": client } }), { params: Promise.resolve({ id: "op-004" }) });
    if (r.status !== 403) throw new Error("9");
    const pData = { name: "Sovereign Market Predictor", client_id: "client-002", project_id: "proj-002", desc: "Sandbox loop" };
    r = await opR.POST(new Request("http://l/api/v1/ai-operations", { method: "POST", headers: { "Authorization": client }, body: JSON.stringify(pData) }));
    if (r.status !== 403) throw new Error("10");
    r = await opR.POST(new Request("http://l/api/v1/ai-operations", { method: "POST", headers: { "Authorization": admin }, body: JSON.stringify(pData) }));
    if (r.status !== 201) throw new Error("11");
    d = await r.json();
    const createdId = d.operation.id;
    if (d.operation.client_name !== "Global Retail Enclave [Preview Client]") throw new Error("12");
    r = await opIdR.PATCH(new Request(`http://l/api/v1/ai-operations/${createdId}`, { method: "PATCH", headers: { "Authorization": client }, body: JSON.stringify({ name: "Hacked" }) }), { params: Promise.resolve({ id: createdId }) });
    if (r.status !== 403) throw new Error("13");
    r = await opIdR.PATCH(new Request(`http://l/api/v1/ai-operations/${createdId}`, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ name: "Sandbox Run", health: "critical" }) }), { params: Promise.resolve({ id: createdId }) });
    if (r.status !== 200) throw new Error("14");
    d = await r.json();
    if (d.operation.name !== "Sandbox Run" || d.operation.health !== "critical") throw new Error("15");
    r = await opIdR.DELETE(new Request(`http://l/api/v1/ai-operations/${createdId}`, { method: "DELETE", headers: { "Authorization": client } }), { params: Promise.resolve({ id: createdId }) });
    if (r.status !== 403) throw new Error("16");
    r = await opIdR.DELETE(new Request(`http://l/api/v1/ai-operations/${createdId}`, { method: "DELETE", headers: { "Authorization": admin } }), { params: Promise.resolve({ id: createdId }) });
    if (r.status !== 200) throw new Error("17");
    r = await opIdR.GET(new Request(`http://l/api/v1/ai-operations/${createdId}`, { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: createdId }) });
    if (r.status !== 404) throw new Error("18");
    console.log("\x1b[32m✔ VERIFICATION SUCCESSFUL: AI Operations CRUD APIs verified flawlessly!\x1b[0m");
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m✖ Validation test failed:\x1b[0m", err.stack || err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
