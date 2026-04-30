#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const bundleRoot = path.resolve(repoRoot, "bundle/mikuproject-skills");
const bundleSkillsRoot = path.resolve(bundleRoot, "skills");
const sourceSkillRoot = path.resolve(repoRoot, "skills/mikuproject");
const sourceRuntimeRoot = path.resolve(sourceSkillRoot, "runtime");
const sourceJavaRuntimePath = path.resolve(sourceRuntimeRoot, "mikuproject.jar");
const sourceJavaSourcesPath = path.resolve(sourceRuntimeRoot, "mikuproject-sources.jar");
const sourceNodeRuntimePath = path.resolve(sourceRuntimeRoot, "mikuproject.mjs");
const sourceNodeSourcesPath = path.resolve(sourceRuntimeRoot, "mikuproject-sources.tgz");

main();

function main() {
  ensureSourceExists(sourceSkillRoot, "skills/mikuproject");
  ensureSourceExists(sourceRuntimeRoot, "skills/mikuproject/runtime");
  ensureSourceExists(sourceJavaRuntimePath, "skills/mikuproject/runtime/mikuproject.jar");
  ensureSourceExists(sourceJavaSourcesPath, "skills/mikuproject/runtime/mikuproject-sources.jar");
  ensureSourceExists(sourceNodeRuntimePath, "skills/mikuproject/runtime/mikuproject.mjs");
  ensureSourceExists(sourceNodeSourcesPath, "skills/mikuproject/runtime/mikuproject-sources.tgz");

  fs.rmSync(bundleRoot, { recursive: true, force: true });
  fs.mkdirSync(bundleSkillsRoot, { recursive: true });

  fs.cpSync(sourceSkillRoot, path.resolve(bundleSkillsRoot, "mikuproject"), {
    recursive: true
  });

  process.stdout.write([
    "[build:bundle] generated bundle/mikuproject-skills",
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    "  - skills/mikuproject",
    "  - skills/mikuproject/runtime/mikuproject.jar",
    "  - skills/mikuproject/runtime/mikuproject-sources.jar",
    "  - skills/mikuproject/runtime/mikuproject.mjs",
    "  - skills/mikuproject/runtime/mikuproject-sources.tgz"
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}
