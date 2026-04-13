#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const bundleRoot = path.resolve(repoRoot, "bundle/mikuproject-skills");
const bundleSkillsRoot = path.resolve(bundleRoot, "skills");
const bundledVendorRoot = path.resolve(
  bundleRoot,
  "skills/mikuproject/vendor/mikuproject"
);
const sourceSkillRoot = path.resolve(repoRoot, "skills/mikuproject");
const sourceVendorRoot = path.resolve(repoRoot, "vendor/mikuproject");

main();

function main() {
  ensureSourceExists(sourceSkillRoot, "skills/mikuproject");
  ensureSourceExists(sourceVendorRoot, "vendor/mikuproject");

  fs.rmSync(bundleRoot, { recursive: true, force: true });
  fs.mkdirSync(bundleSkillsRoot, { recursive: true });

  fs.cpSync(sourceSkillRoot, path.resolve(bundleSkillsRoot, "mikuproject"), {
    recursive: true
  });
  fs.cpSync(sourceVendorRoot, bundledVendorRoot, {
    recursive: true
  });

  process.stdout.write([
    "[build:bundle] generated bundle/mikuproject-skills",
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    "  - skills/mikuproject",
    "  - skills/mikuproject/vendor/mikuproject"
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}
