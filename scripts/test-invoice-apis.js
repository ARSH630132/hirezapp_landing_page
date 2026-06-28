const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-invoice-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/invoices/route.ts app/api/v1/invoices/[id]/route.ts --outDir temp-invoice-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
} catch (e) { process.exit(1); }
const api = require('../temp-invoice-build/lib/api-auth.js');
const r1 = require('../temp-invoice-build/app/api/v1/invoices/route.js');
const r2 = require('../temp-invoice-build/app/api/v1/invoices/[id]/route.js');
const auth = (e) => {
  const u = api.API_MOCK_USERS[e];
  return `Bearer ${api.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}
async function run() {
  try {
    const admin = auth("s.vance@governance.gff.ai"), client = auth("a.mercer@apex-sovereign.gff.ai");
    let res = await r1.GET(new Request("http://l/api/v1/invoices", { headers: { "Authorization": auth("m.vance@sovereign-logistics.gff.ai") } }));
    if (res.status !== 403) throw new Error("Inactive check failed");
    res = await r1.GET(new Request("http://l/api/v1/invoices", { headers: { "Authorization": admin } }));
    let d = await res.json();
    if (d.invoices.length < 4) throw new Error("List size check failed");
    res = await r1.GET(new Request("http://l/api/v1/invoices", { headers: { "Authorization": client } }));
    d = await res.json();
    if (d.invoices.some(i => i.client_id !== "client-001")) throw new Error("Tenant isolation failed");
    res = await r1.GET(new Request("http://l/api/v1/invoices?client_id=client-003", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Tenant cross filter check failed");
    res = await r1.GET(new Request("http://l/api/v1/invoices?search=Retail", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.invoices.length !== 1) throw new Error("Search filter failed");
    res = await r1.GET(new Request("http://l/api/v1/invoices?start_date=2026-06-10&end_date=2026-06-26", { headers: { "Authorization": admin } }));
    if ((await res.json()).invoices.some(i => i.issue_date < "2026-06-10")) throw new Error("Start date filter failed");
    res = await r2.GET(new Request("http://l/api/v1/invoices/inv-001", { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: "inv-001" }) });
    if ((await res.json()).invoice.id !== "inv-001") throw new Error("GET single check failed");
    res = await r2.GET(new Request("http://l/api/v1/invoices/inv-002", { headers: { "Authorization": client } }), { params: Promise.resolve({ id: "inv-002" }) });
    if (res.status !== 403) throw new Error("Cross GET check failed");
    const item = { invoice_number: "GFF-TEST", client_id: "client-002", amount: 1500 };
    res = await r1.POST(new Request("http://l/api/v1/invoices", { method: "POST", headers: { "Authorization": client }, body: JSON.stringify(item) }));
    if (res.status !== 403) throw new Error("Client POST write restriction failed");
    res = await r1.POST(new Request("http://l/api/v1/invoices", { method: "POST", headers: { "Authorization": admin }, body: JSON.stringify(item) }));
    const cid = (await res.json()).invoice.id;
    res = await r2.PATCH(new Request("http://l/api/v1/invoices/" + cid, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ amount: 500 }) }), { params: Promise.resolve({ id: cid }) });
    if ((await res.json()).invoice.amount !== 500) throw new Error("PATCH update check failed");
    res = await r2.DELETE(new Request("http://l/api/v1/invoices/" + cid, { method: "DELETE", headers: { "Authorization": admin } }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("DELETE check failed");
    console.log("\x1b[32m✔ VERIFICATION SUCCESSFUL: Invoices CRUD APIs Verified!\x1b[0m");
  } catch (err) {
    console.error("Test failed error:", err);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();