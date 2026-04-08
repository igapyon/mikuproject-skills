#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const bundleRoot = path.resolve(repoRoot, "bundle/skill-bundle");
const bundleSkillsRoot = path.resolve(bundleRoot, "skills");
const bundledRuntimeRoot = path.resolve(
  bundleRoot,
  "skills/mikuproject/runtime"
);
const sourceSkillRoot = path.resolve(repoRoot, "skills/mikuproject");
const sourceVendorRoot = path.resolve(repoRoot, "vendor/mikuproject");

main();

function main() {
  ensureSourceExists(sourceSkillRoot, "skills/mikuproject");
  ensureSourceExists(sourceVendorRoot, "vendor/mikuproject");

  fs.rmSync(bundleRoot, { recursive: true, force: true });
  fs.mkdirSync(bundleSkillsRoot, { recursive: true });
  fs.mkdirSync(bundledRuntimeRoot, { recursive: true });

  fs.cpSync(sourceSkillRoot, path.resolve(bundleSkillsRoot, "mikuproject"), {
    recursive: true
  });
  fs.cpSync(sourceVendorRoot, path.resolve(bundledRuntimeRoot, "mikuproject"), {
    recursive: true
  });

  writeReadme();

  process.stdout.write([
    "[build:bundle] generated bundle/skill-bundle",
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    "  - skills/mikuproject",
    "  - skills/mikuproject/runtime/mikuproject"
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}

function writeReadme() {
  const readmePath = path.resolve(bundleRoot, "README.md");
  const content = [
    "# skill bundle",
    "",
    "This directory is a first-cut bundle for skill installation.",
    "",
    "## What This Bundle Contains",
    "",
    "- `skills/mikuproject`",
    "- `skills/mikuproject/runtime/mikuproject`",
    "",
    "Copy these contents under your skill home root so that the final layout becomes:",
    "",
    "```text",
    "<skill-home>/",
    "  skills/",
    "    mikuproject/",
    "      runtime/",
    "        mikuproject/",
    "```",
    "",
    "## What You Can Do Now",
    "",
    "- Ask for a WBS directly and let the agent use `mikuproject` internally",
    "- Import `project_draft_view` when you already have external JSON",
    "- Apply `Patch JSON` when you already have external JSON",
    "- Inspect or export workbook state when you explicitly need it",
    "- Use the bundled `mikuproject` CLI for:",
    "  - `ai spec`",
    "  - `state from-draft`",
    "  - `state apply-patch`",
    "  - `export workbook-json`",
    "  - `export xml`",
    "  - `export xlsx`",
    "",
    "## Important Limitation",
    "",
    "The intended mode is agent-internal execution.",
    "",
    "That means the agent should keep intermediate artifacts off-screen and should not stop at visible handoff JSON during normal WBS work.",
    "",
    "Fallback behavior:",
    "",
    "- if the host runtime cannot keep intermediate state hidden, `spec`, `project_draft_view`, `Patch JSON`, or workbook JSON may still appear on screen",
    "- that fallback is usable, but it is not the preferred user experience",
    "",
    "So the target mode is agent-internal hidden workflow, with handoff-style display only as a fallback.",
    "",
    "## Recommended Users Right Now",
    "",
    "- developers",
    "- evaluators",
    "- users who can follow the `spec -> draft -> patch -> workbook` loop when fallback display appears",
    "",
    "## Not Yet Included",
    "",
    "- `report` CLI commands",
    "- guaranteed hidden execution in every host runtime",
    "",
    "## Quick Start",
    "",
    "1. Copy these contents under your skill home root.",
    "2. Restart or reopen your Codex environment if needed.",
    "3. Confirm that `mikuproject` appears in available skills.",
    "4. Start by asking:",
    "   - `れでえいやあでWBSつくって`",
    "   - `この project_draft_view を取り込んで`",
    "   - `この Patch JSON を反映して`"
  ].join("\n");
  fs.writeFileSync(readmePath, `${content}\n`, "utf8");
}
