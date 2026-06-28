/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'temp-api-build');
if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
try {
  execSync('npx tsc lib/api-auth.ts app/api/v1/users/route.ts app/api/v1/users/[id]/route.ts app/api/v1/users/[id]/status/route.ts app/api/v1/users/[id]/role/route.ts --outDir temp-api-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck', { stdio: 'inherit' });
  console.log("✔ Compile success.");
} catch (e) {
  process.exit(1);
}
const apiAuth = require('../temp-api-build/lib/api-auth.js');
const usersRoute = require('../temp-api-build/app/api/v1/users/route.js');
const userIdRoute = require('../temp-api-build/app/api/v1/users/[id]/route.js');
const statusRoute = require('../temp-api-build/app/api/v1/users/[id]/status/route.js');
const roleRoute = require('../temp-api-build/app/api/v1/users/[id]/role/route.js');
function getAuth(email) {
  const u = apiAuth.API_MOCK_USERS[email];
  return `Bearer ${apiAuth.signJwt({ sub: u.id, email: u.email, role: u.role, name: u.name, clientAssociation: u.clientAssociation })}`;
}
async function run() {
  try {
    const admin = getAuth("s.vance@governance.gff.ai");
    const client = getAuth("a.mercer@apex-sovereign.gff.ai");
    const member = getAuth("s.jenkins@fed-treasury.gff.ai");
    let res = await usersRoute.GET(new Request("http://l/api/v1/users", { headers: { "Authorization": member } }));
    if (res.status !== 403) throw new Error("Expected member to get 403");
    res = await usersRoute.GET(new Request("http://l/api/v1/users", { headers: { "Authorization": admin } }));
    if (res.status !== 200) throw new Error("Expected admin to get 200");
    let d = await res.json();
    if (!d.success || d.users.length < 5) throw new Error("Invalid list size");
    if (d.users.some(u => u.passwordHash !== undefined)) throw new Error("passwordHash leaked!");
    const p = { name: "API User", email: "apitest@gff.ai", role: "client_member", password: "MySuperPassword123" };
    res = await usersRoute.POST(new Request("http://l/api/v1/users", { method: "POST", headers: { "Authorization": client, "Content-Type": "application/json" }, body: JSON.stringify(p) }));
    if (res.status !== 403) throw new Error("Expected client to get 403");
    res = await usersRoute.POST(new Request("http://l/api/v1/users", { method: "POST", headers: { "Authorization": admin, "Content-Type": "application/json" }, body: JSON.stringify(p) }));
    if (res.status !== 201) throw new Error("Expected admin to get 201");
    d = await res.json();
    const cid = d.user.id;
    const saved = apiAuth.API_MOCK_USERS["apitest@gff.ai"];
    if (saved.passwordHash === "MySuperPassword123") throw new Error("Password not hashed!");
    if (!apiAuth.verifyUserPassword("apitest@gff.ai", "MySuperPassword123")) throw new Error("Password verify failed");
    res = await userIdRoute.GET(new Request(`http://l/api/v1/users/${cid}`, { headers: { "Authorization": admin } }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("Expected retrieve success");
    res = await userIdRoute.PATCH(new Request(`http://l/api/v1/users/${cid}`, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ name: "API Updated", clearance: "L4" }) }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("Expected patch success");
    res = await statusRoute.PATCH(new Request(`http://l/api/v1/users/${cid}/status`, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ status: "inactive" }) }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("Expected status success");
    res = await roleRoute.PATCH(new Request(`http://l/api/v1/users/${cid}/role`, { method: "PATCH", headers: { "Authorization": admin }, body: JSON.stringify({ role: "client_admin" }) }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("Expected role success");
    d = await res.json();
    if (d.user.role !== "client_admin" || !d.user.permissions.includes("write:projects")) throw new Error("Role sync failed");
    res = await userIdRoute.DELETE(new Request(`http://l/api/v1/users/${cid}`, { method: "DELETE", headers: { "Authorization": admin } }), { params: Promise.resolve({ id: cid }) });
    if (res.status !== 200) throw new Error("Expected delete success");
    if (apiAuth.API_MOCK_USERS["apitest@gff.ai"] !== undefined) throw new Error("User not deleted");
    console.log("\x1b[32m✔ All User Admin CRUD API tests passed successfully!\x1b[0m");
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m✖ Test failed:\x1b[0m", err.stack || err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(T)) fs.rmSync(T, { recursive: true, force: true });
  }
}
run();
