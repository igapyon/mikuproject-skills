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
const bundledVendorNodeModulesRoot = path.resolve(bundledVendorRoot, "node_modules");
const sourceSkillRoot = path.resolve(repoRoot, "skills/mikuproject");
const sourceVendorRoot = path.resolve(repoRoot, "vendor/mikuproject");
const sourceNodeModulesRoot = path.resolve(repoRoot, "node_modules");
const sourcePackageLockPath = path.resolve(repoRoot, "package-lock.json");

main();

function main() {
  ensureSourceExists(sourceSkillRoot, "skills/mikuproject");
  ensureSourceExists(sourceVendorRoot, "vendor/mikuproject");
  ensureSourceExists(sourceNodeModulesRoot, "node_modules");
  ensureSourceExists(sourcePackageLockPath, "package-lock.json");

  fs.rmSync(bundleRoot, { recursive: true, force: true });
  fs.mkdirSync(bundleSkillsRoot, { recursive: true });

  fs.cpSync(sourceSkillRoot, path.resolve(bundleSkillsRoot, "mikuproject"), {
    recursive: true
  });
  fs.cpSync(sourceVendorRoot, bundledVendorRoot, {
    recursive: true
  });
  copyRuntimeDependencies();

  process.stdout.write([
    "[build:bundle] generated bundle/mikuproject-skills",
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    "  - skills/mikuproject",
    "  - skills/mikuproject/vendor/mikuproject",
    "  - skills/mikuproject/vendor/mikuproject/node_modules (runtime only)"
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}

function copyRuntimeDependencies() {
  const packageLock = JSON.parse(fs.readFileSync(sourcePackageLockPath, "utf8"));
  const packages = packageLock.packages || {};
  const requiredPackages = collectRequiredPackages(packages, ["jsdom"]);

  fs.mkdirSync(bundledVendorNodeModulesRoot, { recursive: true });
  for (const packageName of requiredPackages) {
    const sourceDir = path.resolve(sourceNodeModulesRoot, packageName);
    ensureSourceExists(sourceDir, `node_modules/${packageName}`);
    fs.cpSync(sourceDir, path.resolve(bundledVendorNodeModulesRoot, packageName), {
      recursive: true
    });
  }
}

function collectRequiredPackages(packages, roots) {
  const pending = [...roots];
  const required = new Set();

  while (pending.length > 0) {
    const packageName = pending.pop();
    if (!packageName || required.has(packageName)) {
      continue;
    }

    const packageKey = `node_modules/${packageName}`;
    const packageInfo = packages[packageKey];
    if (!packageInfo) {
      throw new Error(`package-lock.json missing entry for ${packageKey}`);
    }

    required.add(packageName);
    for (const dependencyName of Object.keys(packageInfo.dependencies || {})) {
      pending.push(dependencyName);
    }
  }

  return Array.from(required).sort((left, right) => left.localeCompare(right));
}
