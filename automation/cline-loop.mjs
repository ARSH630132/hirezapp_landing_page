#!/usr/bin/env node

/**
 * Cline autonomous loop runner for GFF AI Phase 0-2.
 *
 * Usage:
 *   node automation/cline-loop.mjs
 *
 * Optional env:
 *   MAX_HOURS=3
 *   TASKS_FILE=automation/tasks.json
 *   CLINE_BIN=cline
 *   CLINE_ARGS="-y --json"
 *   DRY_RUN=1
 *
 * Notes:
 * - Requires Cline CLI installed and authenticated.
 * - Uses git checkpoints before each task.
 * - Runs lint/build after implementation tasks.
 * - Blocks forbidden architecture regressions.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const PROJECT_ROOT = process.cwd();
const TASKS_FILE = process.env.TASKS_FILE || "automation/tasks.json";
const MAX_HOURS = Number(process.env.MAX_HOURS || 3);
const MAX_MS = MAX_HOURS * 60 * 60 * 1000;
const START = Date.now();

const CLINE_BIN = process.env.CLINE_BIN || "cline";
const CLINE_ARGS = (process.env.CLINE_ARGS || "-y --json")
  .split(" ")
  .filter(Boolean);

const DRY_RUN = process.env.DRY_RUN === "1";
const LOG_DIR = path.join(PROJECT_ROOT, "automation", "logs");
const STATE_FILE = path.join(PROJECT_ROOT, "automation", "state.json");

fs.mkdirSync(LOG_DIR, { recursive: true });

const REQUIRED_FILES_PROTECTED = [
  "app/[...slug]/page.tsx",
  "components/PublicRoutePage.tsx"
];

const LANDING_PROTECTED_PATTERNS = [
  "components/sections/HeroSection.tsx"
];

const GLOBAL_GUARDRAILS = `
GLOBAL NON-NEGOTIABLE RULES

You are working in the GFF AI website codebase.

Do not hallucinate. Do not invent fake clients, fake metrics, fake dashboards, fake logos, fake reports, fake authors, fake downloads, fake office addresses, fake auth, fake OTP, or fake exports.

Do not add backend functionality.
Do not add FastAPI yet.
Do not add AWS.
Do not add auth.
Do not add real OTP sending.
Do not add real email sending.
Do not add database calls.
Do not add real API integrations.
Do not add credentials or env requirements.

Do not reintroduce slug routing.
Do not create app/[...slug]/page.tsx.
Do not create components/PublicRoutePage.tsx.
Do not import PublicRoutePage.

All public routes must remain explicit App Router pages.

For existing approved landing page UI:
- Preserve hero layout.
- Preserve right-side video placement.
- Preserve approved header/footer visual design.
- Preserve existing landing section visual design.
- Only touch landing sections when the specific task says allowLandingChanges=true.

Design quality:
- Premium 2026 enterprise AI website.
- Follow current landing page theme.
- Clean, Apple-like, custom, expensive.
- Avoid box-inside-box clutter.
- Avoid excessive pills/badges.
- Avoid random neon.
- Avoid generic robot imagery.
- Use Framer Motion only if already installed.
- Use lightweight local CSS/SVG/animation effects.
- Mobile responsive and accessible.
`;

function run(cmd, args = [], opts = {}) {
  const result = spawnSync(cmd, args, {
  cwd: PROJECT_ROOT,
  encoding: "utf8",
  shell: false,
  timeout: Number(process.env.CLINE_TIMEOUT_MS || 1000 * 60 * 25),
  maxBuffer: 1024 * 1024 * 50,
  ...opts
});

  return {
    code: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    ok: result.status === 0
  };
}

function sh(command) {
  const result = spawnSync(command, {
    cwd: PROJECT_ROOT,
    encoding: "utf8",
    shell: true,
    maxBuffer: 1024 * 1024 * 50
  });
  return {
    code: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    ok: result.status === 0
  };
}

function log(taskId, name, content) {
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const safe = `${taskId}-${name}`.replace(/[^a-z0-9._-]+/gi, "-");
  const file = path.join(
    LOG_DIR,
    `${new Date().toISOString().replace(/[:.]/g, "-")}-${safe}.log`
  );

  fs.writeFileSync(file, content || "");
  return file;
}

function loadTasks() {
  const full = path.join(PROJECT_ROOT, TASKS_FILE);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { completed: [], failed: [] };
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function gitStatus() {
  return sh("git status --short").stdout.trim();
}

function gitDiffNameOnly() {
  return sh("git diff --name-only").stdout.trim().split("\n").filter(Boolean);
}

function checkpoint(label) {
  const safeLabel = label.replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
  sh(`git add -A && git commit -m "checkpoint: ${safeLabel}"`);
}

function hasPackageScript(name) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf8"));
    return Boolean(pkg.scripts && pkg.scripts[name]);
  } catch {
    return false;
  }
}

function runValidation() {
  const outputs = [];

  if (hasPackageScript("lint")) {
    const r = sh("npm run lint");
    outputs.push(`## npm run lint\nexit=${r.code}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
    if (!r.ok) return { ok: false, output: outputs.join("\n\n") };
  }

  if (hasPackageScript("typecheck")) {
    const r = sh("npm run typecheck");
    outputs.push(`## npm run typecheck\nexit=${r.code}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
    if (!r.ok) return { ok: false, output: outputs.join("\n\n") };
  }

  if (hasPackageScript("test")) {
    const r = sh("npm test -- --runInBand");
    outputs.push(`## npm test\nexit=${r.code}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
    if (!r.ok) return { ok: false, output: outputs.join("\n\n") };
  }

  if (hasPackageScript("build")) {
    const r = sh("npm run build");
    outputs.push(`## npm run build\nexit=${r.code}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
    if (!r.ok) return { ok: false, output: outputs.join("\n\n") };
  }

  return { ok: true, output: outputs.join("\n\n") };
}

function forbiddenArchitectureCheck(task) {
  const errors = [];

  for (const f of REQUIRED_FILES_PROTECTED) {
    if (fs.existsSync(path.join(PROJECT_ROOT, f))) {
      errors.push(`Forbidden file exists: ${f}`);
    }
  }

  const grep = sh("grep -R \"PublicRoutePage\\|app/\\[\\.\\.\\.slug\\]\\|components/PublicRoutePage\" -n app components lib 2>/dev/null || true");
  if (grep.stdout.trim()) {
    errors.push(`Forbidden slug/PublicRoutePage references found:\n${grep.stdout}`);
  }

  if (!task.allowLandingChanges) {
    const changed = gitDiffNameOnly();
    const landingChanged = changed.filter((file) => {
      return (
        file === "app/page.tsx" ||
        file === "components/LandingPage.tsx" ||
        LANDING_PROTECTED_PATTERNS.some((p) => file === p)
      );
    });

    if (landingChanged.length) {
      errors.push(`Landing-protected files changed in a task that forbids landing edits:\n${landingChanged.join("\n")}`);
    }
  }

  return {
    ok: errors.length === 0,
    output: errors.join("\n\n")
  };
}

function cline(prompt, taskId, phaseName) {
  const fullPrompt = `${GLOBAL_GUARDRAILS}

CURRENT TASK ID: ${taskId}

${prompt}

Required final response:
- Files changed
- Summary of implementation
- Validation done
- Any limitations
`;

  const args = [...CLINE_ARGS, fullPrompt];

  if (DRY_RUN) {
    console.log(`\n[DRY RUN] ${CLINE_BIN} ${args.join(" ").slice(0, 500)}...\n`);
    return { ok: true, output: "dry run" };
  }

  const r = run(CLINE_BIN, args);
  const combined = `COMMAND: ${CLINE_BIN} ${CLINE_ARGS.join(" ")} "<prompt>"\nEXIT: ${r.code}\n\nSTDOUT:\n${r.stdout}\n\nSTDERR:\n${r.stderr}`;
  log(taskId, phaseName, combined);

  return {
    ok: r.ok,
    output: combined
  };
}

function makeImplementationPrompt(task) {
  return `
Implement this task only.

Title:
${task.title}

Scope:
${task.scope}

Target:
${task.target}

allowLandingChanges:
${task.allowLandingChanges}

Task requirement:
${task.prompt}

Process:
1. Inspect only relevant files.
2. Make the smallest safe changes needed for this task.
3. Preserve approved UI unless this task explicitly requires a new missing section or page design.
4. Do not modify landing page files unless allowLandingChanges is true.
5. Keep all functionality frontend-only.
6. Do not reintroduce slug route logic.
7. Make the result premium, responsive, accessible, and consistent with the approved landing design.
8. Run only targeted local checks if needed, but the outer automation will run lint/build afterwards.
`;
}

function makeFixPrompt(task, validationOutput, architectureOutput) {
  return `
Fix only the issues from the last task.

Task:
${task.title}

Validation output:
${validationOutput || "No validation output"}

Architecture guardrail output:
${architectureOutput || "No architecture guardrail output"}

Rules:
- Fix only errors caused by the last task.
- Do not add new features.
- Do not redesign unrelated UI.
- Do not touch landing page if allowLandingChanges is false.
- Do not reintroduce slug routing.
- Do not add backend/API/AWS/auth/OTP/export behavior.
- After fixing, summarize changed files and what was fixed.
`;
}

function makeReviewPrompt(task) {
  return `
Review the most recent changes for this task. You may make small fixes only if they are necessary.

Task:
${task.title}

Checklist:
1. Requirement satisfied?
2. Landing page untouched unless allowLandingChanges=true?
3. No slug routing?
4. No PublicRoutePage?
5. No backend/API/AWS/auth/OTP/export behavior?
6. No fake clients/logos/metrics/reports/downloads?
7. UI premium and consistent?
8. Mobile responsive?
9. Accessible headings/buttons/forms?
10. No obvious broken links/imports?

If everything is good, do not edit files. If there is a clear issue, fix only that issue.
`;
}

function revertTask(task) {
  console.error(`Reverting task ${task.id} due to guardrail failure.`);

  // Revert tracked changes back to the last checkpoint commit.
  sh("git reset --hard HEAD");

  // Remove untracked files created by the failed task, but preserve automation runtime files.
  sh("git clean -fd -e automation/logs -e automation/state.json");

  fs.mkdirSync(LOG_DIR, { recursive: true });
}

async function main() {
  const tasks = loadTasks();
  const state = loadState();

  console.log(`Loaded ${tasks.length} tasks.`);
  console.log(`Max runtime: ${MAX_HOURS} hour(s).`);
  console.log(`Cline: ${CLINE_BIN} ${CLINE_ARGS.join(" ")}`);

  const initialStatus = gitStatus();
  if (initialStatus) {
    console.log("\nWorking tree is not clean. Creating safety checkpoint with current changes.");
    sh("git add -A && git commit -m \"checkpoint: pre-autonomous-loop\" || true");
  }

  for (const task of tasks) {
    if (Date.now() - START > MAX_MS) {
      console.log("Max runtime reached. Stopping.");
      break;
    }

    if (state.completed.includes(task.id)) {
      console.log(`Skipping completed task: ${task.id}`);
      continue;
    }

    console.log(`\n==============================`);
    console.log(`TASK: ${task.id} - ${task.title}`);
    console.log(`==============================`);

    checkpoint(`before ${task.id}`);

    const impl = cline(makeImplementationPrompt(task), task.id, "implement");
    if (!impl.ok) {
      state.failed.push({ id: task.id, reason: "cline implementation failed" });
      saveState(state);
      console.error(`Cline failed for ${task.id}. Continuing to next task.`);
      continue;
    }
    if (task.scope === "audit" || task.scope === "final-qa") {
  console.log(`Audit/QA task completed without automatic fix-loop: ${task.id}`);

  const guard = forbiddenArchitectureCheck(task);
  log(task.id, "guard-audit", guard.output || "guard ok");

  // For audit tasks, do not auto-fix or revert. The audit output is the deliverable.
  state.completed.push(task.id);
  saveState(state);

  checkpoint(`complete ${task.id}`);
  continue;
}

    let guard = forbiddenArchitectureCheck(task);
    let validation = runValidation();

    log(task.id, "guard", guard.output || "guard ok");
    log(task.id, "validation", validation.output || "validation ok");

    let attempts = 0;
    const MAX_FIX_ATTEMPTS = 2;

    while ((!guard.ok || !validation.ok) && attempts < MAX_FIX_ATTEMPTS) {
      attempts += 1;
      console.log(`Fix attempt ${attempts} for ${task.id}`);

      const fix = cline(makeFixPrompt(task, validation.output, guard.output), task.id, `fix-${attempts}`);
      if (!fix.ok) break;

      guard = forbiddenArchitectureCheck(task);
      validation = runValidation();

      log(task.id, `guard-after-fix-${attempts}`, guard.output || "guard ok");
      log(task.id, `validation-after-fix-${attempts}`, validation.output || "validation ok");
    }

    if (!guard.ok) {
      log(task.id, "failed-guard-final", guard.output);
      revertTask(task);
      state.failed.push({ id: task.id, reason: "architecture guard failed", details: guard.output });
      saveState(state);
      continue;
    }

    if (!validation.ok) {
      log(task.id, "failed-validation-final", validation.output);
      revertTask(task);
      state.failed.push({ id: task.id, reason: "validation failed" });
      saveState(state);
      continue;
    }

    const review = cline(makeReviewPrompt(task), task.id, "review");
    if (!review.ok) {
      console.warn(`Review call failed for ${task.id}, but validation passed. Keeping changes.`);
    }

    guard = forbiddenArchitectureCheck(task);
    validation = runValidation();

    if (!guard.ok || !validation.ok) {
      log(task.id, "failed-after-review", `${guard.output}\n\n${validation.output}`);
      revertTask(task);
      state.failed.push({ id: task.id, reason: "failed after review" });
      saveState(state);
      continue;
    }

    checkpoint(`complete ${task.id}`);
    state.completed.push(task.id);
    saveState(state);

    console.log(`Completed ${task.id}`);
  }

  const finalStatus = gitStatus();
  const finalValidation = runValidation();

  const summary = {
    completed: state.completed,
    failed: state.failed,
    finalStatus,
    finalValidationOk: finalValidation.ok,
    finishedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(LOG_DIR, "final-summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log("\nFinal summary:");
  console.log(JSON.stringify(summary, null, 2));

  if (!finalValidation.ok) {
    console.error("\nFinal validation failed. See automation/logs.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});