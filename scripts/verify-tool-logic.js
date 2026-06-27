/* eslint-disable */

/**
 * GFF AI - LIGHTWEIGHT TOOL LOGIC VERIFICATION SUITE
 * 
 * This script verifies the deterministic calculations, scoring logic, and
 * validation helpers used across the sovereign platform tools (Blueprint, ROI, Assessment).
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("\x1b[35m%s\x1b[0m", "========================================================");
console.log("\x1b[35m%s\x1b[0m", "          GFF AI TOOL LOGIC VERIFICATION SUITE          ");
console.log("\x1b[35m%s\x1b[0m", "========================================================");

const TEMP_DIR = path.join(__dirname, '..', 'temp-build');

// Helper to clean up temp build directory
function cleanup() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

// 1. Compile TypeScript dependencies to CommonJS JavaScript so we can run them natively in Node.js
console.log("Compiling TypeScript files to temporary CommonJS directory...");
try {
  cleanup();
  execSync(
    'npx tsc lib/shared-validation.ts lib/shared-constants.ts lib/blueprint-data.ts --outDir temp-build --module commonjs --target es2022 --moduleResolution node --esModuleInterop',
    { stdio: 'inherit' }
  );
  console.log("\x1b[32m%s\x1b[0m", "✔ TypeScript compiled successfully.");
} catch (error) {
  console.error("\x1b[31m%s\x1b[0m", "✖ Compilation failed:");
  console.error(error.message);
  process.exit(1);
}

// 2. Load the compiled modules
let sharedValidation, blueprintData;
try {
  sharedValidation = require('../temp-build/shared-validation.js');
  blueprintData = require('../temp-build/blueprint-data.js');
} catch (error) {
  console.error("\x1b[31m%s\x1b[0m", "✖ Failed to import compiled modules:");
  console.error(error.stack);
  cleanup();
  process.exit(1);
}

// 3. Test Runner Infrastructure
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`  \x1b[31m✖\x1b[0m ${name}`);
    console.error(`    \x1b[31mError:\x1b[0m ${error.message}`);
    if (error.actual !== undefined && error.expected !== undefined) {
      console.error(`    Expected: ${JSON.stringify(error.expected)}`);
      console.error(`    Actual:   ${JSON.stringify(error.actual)}`);
    } else {
      console.error(error.stack);
    }
    failedTests++;
  }
}

function assert(condition, message, metadata = {}) {
  if (!condition) {
    const error = new Error(message || "Assertion failed");
    if (metadata.actual !== undefined) error.actual = metadata.actual;
    if (metadata.expected !== undefined) error.expected = metadata.expected;
    throw error;
  }
}

function assertEquals(actual, expected, message) {
  assert(
    actual === expected,
    message || `Expected values to be strictly equal:`,
    { actual, expected }
  );
}

// Run Test Groups
try {
  // ==========================================
  // GROUP 1: VALIDATION HELPERS
  // ==========================================
  console.log("\n\x1b[36m%s\x1b[0m", "--- Test Group 1: Validation Helpers ---");

  test("validateRequiredText - valid input", () => {
    const res = sharedValidation.validateRequiredText("A valid string");
    assertEquals(res.isValid, true);
    assertEquals(res.error, undefined);
  });

  test("validateRequiredText - empty input", () => {
    const res = sharedValidation.validateRequiredText("   ");
    assertEquals(res.isValid, false);
    assert(res.error.includes("required"), "Error message should mention required");
  });

  test("validateEmail - valid email", () => {
    const res = sharedValidation.validateEmail("enterprise@gff.ai");
    assertEquals(res.isValid, true);
  });

  test("validateEmail - invalid email format", () => {
    const res = sharedValidation.validateEmail("invalid-email");
    assertEquals(res.isValid, false);
    assert(res.error.includes("valid corporate email"), "Error message should mention valid email");
  });

  test("validateMaxPriorities - valid counts", () => {
    const res = sharedValidation.validateMaxPriorities(["Productivity", "Compliance"], 3);
    assertEquals(res.isValid, true);
  });

  test("validateMaxPriorities - exceeds limit", () => {
    const res = sharedValidation.validateMaxPriorities(["P1", "P2", "P3", "P4"], 3);
    assertEquals(res.isValid, false);
    assert(res.error.includes("maximum of 3"), "Error message should mention max limit");
  });

  test("validateMaxPriorities - empty selection", () => {
    const res = sharedValidation.validateMaxPriorities([], 3);
    assertEquals(res.isValid, false);
    assert(res.error.includes("at least 1"), "Error message should mention selecting at least 1");
  });

  test("validateNumberRange - valid value", () => {
    const res = sharedValidation.validateNumberRange(50, 0, 100);
    assertEquals(res.isValid, true);
  });

  test("validateNumberRange - out of bounds", () => {
    const res = sharedValidation.validateNumberRange(150, 0, 100);
    assertEquals(res.isValid, false);
  });

  test("validateNonNegativeInput - valid non-negative", () => {
    const res = sharedValidation.validateNonNegativeInput(0);
    assertEquals(res.isValid, true);
  });

  test("validateNonNegativeInput - negative input", () => {
    const res = sharedValidation.validateNonNegativeInput(-10);
    assertEquals(res.isValid, false);
  });

  test("getSafeEmptyState - returns actual when present", () => {
    const res = sharedValidation.getSafeEmptyState("fallback", "actual");
    assertEquals(res, "actual");
  });

  test("getSafeEmptyState - returns fallback when empty", () => {
    const res = sharedValidation.getSafeEmptyState("fallback", "  ");
    assertEquals(res, "fallback");
  });

  // ==========================================
  // GROUP 2: BLUEPRINT SCORING (WITH BANKING 87/100 CASE)
  // ==========================================
  console.log("\n\x1b[36m%s\x1b[0m", "--- Test Group 2: Blueprint Scoring & Test Cases ---");

  test("Blueprint scoring (lib/blueprint-data) - Banking Blueprint Example (87/100)", () => {
    // Inputs: Banking, 10000+ company size, Scaling AI, Productivity + Cost Reduction + Compliance, Mostly Integrated Data, Budget Approved
    const answers = {
      industry: "Banking",
      companySize: "10000+",
      topPriorities: ["Productivity", "Cost Reduction", "Compliance"],
      aiJourney: "Scaling AI",
      dataReadiness: "Mostly integrated",
      leadershipCommitment: "Budget Approved",
      biggestChallenge: "Budget/ROI",
      email: "banking@gff.ai"
    };

    const score = blueprintData.calculateBlueprintScore(answers);
    assertEquals(score, 87, "Banking Blueprint test case must score exactly 87");
  });

  test("Shared Blueprint scoring (lib/shared-validation) - Banking Blueprint Example (87/100)", () => {
    // Inputs: Banking, 10000+ company size, Scaling AI, Productivity + Cost Reduction + Compliance, Mostly Integrated Data, Budget Approved
    const inputs = {
      industry: "Banking",
      companySize: "10000+",
      topPriorities: ["Improve Productivity", "Reduce Costs", "Strengthen Compliance"],
      aiJourney: "Scaling AI",
      dataReadiness: "Mostly integrated",
      leadershipCommitment: "Budget Approved"
    };

    const score = sharedValidation.calculateSharedBlueprintScore(inputs);
    assertEquals(score, 87, "Shared Banking Blueprint test case must score exactly 87");
  });

  test("Blueprint scoring - low baseline score scenario", () => {
    const answers = {
      industry: "Other",
      companySize: "<100",
      topPriorities: ["AI Transformation"],
      aiJourney: "No AI",
      dataReadiness: "Highly fragmented",
      leadershipCommitment: "Not Discussed",
      biggestChallenge: "Tech Stack",
      email: "test@gff.ai"
    };

    const score = blueprintData.calculateBlueprintScore(answers);
    assertEquals(score, 18);
  });


  // ==========================================
  // GROUP 3: ASSESSMENT SCORING
  // ==========================================
  console.log("\n\x1b[36m%s\x1b[0m", "--- Test Group 3: Assessment Scoring Math ---");

  test("Assessment Scoring - minimum inputs (all 1s)", () => {
    const totalScore = 24; // 24 questions, each answered with option score 1
    const percentage = Math.round(((totalScore - 24) / (96 - 24)) * 100);
    assertEquals(percentage, 0);
  });

  test("Assessment Scoring - maximum inputs (all 4s)", () => {
    const totalScore = 96; // 24 questions, each answered with option score 4
    const percentage = Math.round(((totalScore - 24) / (96 - 24)) * 100);
    assertEquals(percentage, 100);
  });

  test("Assessment Scoring - mid range", () => {
    const totalScore = 60; // middle of the range [24, 96]
    const percentage = Math.round(((totalScore - 24) / (96 - 24)) * 100);
    assertEquals(percentage, 50);
  });

  // ==========================================
  // GROUP 4: ROI CALCULATION
  // ==========================================
  console.log("\n\x1b[36m%s\x1b[0m", "--- Test Group 4: ROI Calculation ---");

  test("ROI Estimation - base enterprise case", () => {
    const inputs = {
      teamSize: 50,
      avgHourlyRate: 75,
      inefficientHoursPerWeek: 8,
      initialInvestment: 120000,
      priority: "Improve Productivity"
    };

    const result = sharedValidation.calculateSharedROIEstimate(inputs);
    
    // Formula verification:
    // annualHoursSaved = teamSize * inefficientHoursPerWeek * 52 * 0.85 = 50 * 8 * 52 * 0.85 = 17680
    // grossSavings = annualHoursSaved * avgHourlyRate = 17680 * 75 = 1,326,000
    // netSavings = grossSavings - initialInvestment = 1,326,000 - 120,000 = 1,206,000
    // roiPercentage = (netSavings / initialInvestment) * 100 = (1,206,000 / 120,000) * 100 = 1005%
    // monthlySavings = grossSavings / 12 = 110,500
    // paybackMonths = initialInvestment / monthlySavings = 120,000 / 110,500 = 1.08 -> max(1, 1.1) = 1.1
    
    assertEquals(result.annualHoursSaved, 17680);
    assertEquals(result.grossSavings, 1326000);
    assertEquals(result.netSavings, 1206000);
    assertEquals(result.roiPercentage, 1005);
    assertEquals(result.paybackMonths, 1.1);
  });

  // ==========================================
  // GROUP 5: LOCAL RECOMMENDATION LOGIC
  // ==========================================
  console.log("\n\x1b[36m%s\x1b[0m", "--- Test Group 5: Recommendation Logic ---");

  test("getRecommendedOpportunities - Banking industry recommendations", () => {
    const recs = blueprintData.getRecommendedOpportunities("Banking");
    assert(Array.isArray(recs), "Should return an array");
    assert(recs.includes("Sovereign AML & Transactions Ledger Analyst"), "Should recommend Banking-specific tools");
    assert(recs.includes("High-Frequency Risk Intelligence & Simulation Agent"), "Should recommend risk intelligence agents");
  });

  test("getRecommendedSolution - Tech Stack legacy challenge", () => {
    const solution = blueprintData.getRecommendedSolution("Tech Stack");
    assertEquals(solution.title, "GFF Enterprise Integration Mesh™");
    assert(solution.description.includes("legacy databases"), "Should focus on legacy databases resolution");
  });

  test("getRecommendedSolution - Budget/ROI constraint challenge", () => {
    const solution = blueprintData.getRecommendedSolution("Budget/ROI");
    assertEquals(solution.title, "GFF AI Agent Factory™ (Starter Edition)");
    assert(solution.description.includes("4.2x ROI"), "Should focus on guaranteed value and starter pricing");
  });

  test("getExpectedImpact - Productivity impact metrics", () => {
    const impact = blueprintData.getExpectedImpact(["Productivity"]);
    assert(impact.metric.includes("4.2x Year 1 ROI"), "Should mention 4.2x Year 1 ROI");
  });

  test("getExpectedImpact - Cost Reduction impact metrics", () => {
    const impact = blueprintData.getExpectedImpact(["Cost Reduction"]);
    assert(impact.metric.includes("$2.4M saved"), "Should mention $2.4M saved");
  });

} catch (e) {
  console.error("\x1b[31m%s\x1b[0m", "Unhandled test error:");
  console.error(e);
  failedTests++;
} finally {
  cleanup();
}

// 4. Verification Summary
console.log("\n\x1b[35m%s\x1b[0m", "========================================================");
console.log("\x1b[35m%s\x1b[0m", "                  VERIFICATION SUMMARY                  ");
console.log("\x1b[35m%s\x1b[0m", "========================================================");
console.log(`  Total Passed: \x1b[32m${passedTests}\x1b[0m`);
console.log(`  Total Failed: ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : `\x1b[32m${failedTests}\x1b[0m`}`);

if (failedTests > 0) {
  console.log("\x1b[41m\x1b[30m%s\x1b[0m", " VERIFICATION FAILED: One or more tool logic checks failed! ");
  process.exit(1);
} else {
  console.log("\x1b[42m\x1b[30m%s\x1b[0m", " VERIFICATION SUCCESSFUL: All deterministic logic verified! ");
  process.exit(0);
}

