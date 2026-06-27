/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("\x1b[35m========================================================\x1b[0m");
console.log("\x1b[35m       GFF AI - AUTH GATEWAY LOGIC VERIFICATION SUITE   \x1b[0m");
console.log("\x1b[35m========================================================\x1b[0m");

const TEMP_DIR = path.join(__dirname, '..', 'temp-auth-build');

function cleanup() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

console.log("Compiling Authentication Modules...");
try {
  cleanup();
  execSync(
    'npx tsc lib/api-auth.ts --outDir temp-auth-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop',
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error("✖ Compilation failed:", error.message);
  process.exit(1);
}

let apiAuth;
try {
  apiAuth = require('../temp-auth-build/api-auth.js');
} catch (error) {
  console.error("✖ Failed to import compiled auth module:", error.stack);
  cleanup();
  process.exit(1);
}

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passed++;
  } catch (error) {
    console.log(`  \x1b[31m✖\x1b[0m ${name}`);
    console.error(`    \x1b[31mError:\x1b[0m ${error.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "Assertion failed");
}

try {
  console.log("\n\x1b[36m--- Test Group 1: Cryptographic JWT Operations ---\x1b[0m");

  test("signJwt & verifyJwt - success path with valid payload", () => {
    const payload = { sub: "usr-001", email: "s.vance@governance.gff.ai", role: "gff_admin" };
    const token = apiAuth.signJwt(payload);
    assert(token && token.split('.').length === 3, "Token must have exactly 3 parts");
    
    const decoded = apiAuth.verifyJwt(token);
    assert(decoded !== null, "Decoded token must not be null");
    assert(decoded.sub === "usr-001", "Sub match failed");
    assert(decoded.email === "s.vance@governance.gff.ai", "Email match failed");
    assert(decoded.role === "gff_admin", "Role match failed");
  });

  test("verifyJwt - reject modified signature", () => {
    const token = apiAuth.signJwt({ sub: "usr-001" });
    const parts = token.split('.');
    parts[2] = parts[2].substring(0, parts[2].length - 3) + "XYZ";
    assert(apiAuth.verifyJwt(parts.join('.')) === null, "Tampered signature should fail");
  });

  test("verifyJwt - reject modified payload", () => {
    const token = apiAuth.signJwt({ sub: "usr-001" });
    const parts = token.split('.');
    const pl = JSON.parse(apiAuth.base64UrlDecode(parts[1]));
    pl.sub = "usr-002";
    parts[1] = apiAuth.base64UrlEncode(JSON.stringify(pl));
    assert(apiAuth.verifyJwt(parts.join('.')) === null, "Tampered payload should fail");
  });

  test("verifyJwt - reject expired token", () => {
    const token = apiAuth.signJwt({ sub: "usr-001" }, undefined, -10);
    assert(apiAuth.verifyJwt(token) === null, "Expired token should fail");
  });

  console.log("\n\x1b[36m--- Test Group 2: User Lookup and Password Verifications ---\x1b[0m");

  test("verifyUserPassword - correct passwords", () => {
    assert(apiAuth.verifyUserPassword("s.vance@governance.gff.ai", "VanceSecure2026!"), "Vance custom pass failed");
    assert(apiAuth.verifyUserPassword("a.mercer@apex-sovereign.gff.ai", "MercerSecure2026!"), "Mercer custom pass failed");
    assert(apiAuth.verifyUserPassword("s.vance@governance.gff.ai", "gff-secure-2026!"), "Vance dev pass failed");
  });

  test("verifyUserPassword - incorrect password or unknown email", () => {
    assert(!apiAuth.verifyUserPassword("s.vance@governance.gff.ai", "wrong"), "Incorrect pass should fail");
    assert(!apiAuth.verifyUserPassword("unknown@gff.ai", "password123"), "Unknown email should fail");
  });

  test("verifyUserStatus - inactive flag validation", () => {
    const user = apiAuth.API_MOCK_USERS["m.vance@sovereign-logistics.gff.ai"];
    assert(user && user.status === "inactive", "Marcus Vance should be inactive");
  });

  console.log("\n\x1b[35m========================================================\x1b[0m");
  console.log(`  Total Passed: \x1b[32m${passed}\x1b[0m | Failed: \x1b[31m${failed}\x1b[0m`);
  
  if (failed > 0) {
    console.log("\x1b[41m\x1b[37m VERIFICATION FAILED \x1b[0m");
    cleanup();
    process.exit(1);
  } else {
    console.log("\x1b[42m\x1b[30m VERIFICATION SUCCESSFUL: Auth logic verified! \x1b[0m");
  }
} catch (e) {
  console.error("Crash during tests:", e);
  cleanup();
  process.exit(1);
}

cleanup();
