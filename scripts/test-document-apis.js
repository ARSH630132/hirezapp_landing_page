const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-documents-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/documents/route.ts app/api/v1/documents/[id]/route.ts --outDir temp-documents-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'ignore' });
} catch (e) { 
  console.error("Comp failed:", e);
  process.exit(1); 
}
const api = require('../temp-documents-build/lib/api-auth.js');
const r1 = require('../temp-documents-build/app/api/v1/documents/route.js');
const r2 = require('../temp-documents-build/app/api/v1/documents/[id]/route.js');

const auth = (e) => {
  const u = api.API_MOCK_USERS[e];
  return `Bearer ${api.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}

async function run() {
  try {
    const admin = auth("s.vance@governance.gff.ai"), client = auth("a.mercer@apex-sovereign.gff.ai");
    
    // Inactive check
    let res = await r1.GET(new Request("http://l/api/v1/documents", { headers: { "Authorization": auth("m.vance@sovereign-logistics.gff.ai") } }));
    if (res.status !== 403) throw new Error("Inactive check failed");
    
    // Admin list
    res = await r1.GET(new Request("http://l/api/v1/documents", { headers: { "Authorization": admin } }));
    let d = await res.json();
    if (d.documents.length < 4) throw new Error("List size check failed");
    
    // Tenant isolation
    res = await r1.GET(new Request("http://l/api/v1/documents", { headers: { "Authorization": client } }));
    d = await res.json();
    if (d.documents.some(i => i.client_id !== "client-001")) throw new Error("Tenant isolation failed");
    
    // Cross tenant filter check
    res = await r1.GET(new Request("http://l/api/v1/documents?client_id=client-003", { headers: { "Authorization": client } }));
    if (res.status !== 403) throw new Error("Tenant cross filter check failed");
    
    // Search filter
    res = await r1.GET(new Request("http://l/api/v1/documents?search=Blueprint", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.documents.length < 1) throw new Error("Search filter failed");
    
    // Document Type filter
    res = await r1.GET(new Request("http://l/api/v1/documents?document_type=PDF", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.documents.some(doc => doc.document_type !== "PDF")) throw new Error("Document Type filter failed");

    // Project ID filter
    res = await r1.GET(new Request("http://l/api/v1/documents?project_id=proj-001", { headers: { "Authorization": admin } }));
    d = await res.json();
    if (d.documents.some(doc => doc.project_id !== "proj-001")) throw new Error("Project ID filter failed");

    // GET single document
    res = await r2.GET(new Request("http://l/api/v1/documents/doc-801", { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: "doc-801" }) });
    if ((await res.json()).document.id !== "DOC-801") throw new Error("GET single check failed");
    
    // Cross GET check
    res = await r2.GET(new Request("http://l/api/v1/documents/doc-803", { headers: { "Authorization": client } }), { params: Promise.resolve({ id: "doc-803" }) });
    if (res.status !== 403) throw new Error("Cross GET check failed");
    
    // POST create document metadata
    const item = { title: "TEST_DOC", client_id: "client-002", document_type: "PDF", description: "Test desc" };
    res = await r1.POST(new Request("http://l/api/v1/documents", { method: "POST", headers: { "Authorization": client }, body: JSON.stringify(item) }));
    if (res.status !== 403) throw new Error("Client POST write restriction failed");
    
    res = await r1.POST(new Request("http://l/api/v1/documents", { method: "POST", headers: { "Authorization": admin }, body: JSON.stringify(item) }));
    if (res.status !== 201) throw new Error("POST create failed: " + res.status);
    
    const createdItem = (await res.json()).document;
    const cid = createdItem.id;
    if (createdItem.title !== "TEST_DOC") throw new Error("POST create returned incorrect title");
    
    // PATCH update document metadata
    res = await r2.PATCH(new Request("http://l/api/v1/documents/" + cid, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ description: "Updated desc" }) }), { params: Promise.resolve({ id: cid }) });
    if ((await res.json()).document.description !== "Updated desc") throw new Error("PATCH update check failed");
    
    // DELETE document
    res = await r2.DELETE(new Request("http://l/api/v1/documents/" + cid, { method: "DELETE", headers: { "Authorization": admin } }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("DELETE check failed");
    
    console.log("\x1b[32m✔ VERIFICATION SUCCESSFUL: Documents CRUD APIs Verified!\x1b[0m");
  } catch (err) {
    console.error("Test failed error:", err);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
