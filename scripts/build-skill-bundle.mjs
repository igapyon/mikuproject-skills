#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { CORE_API_MODULE_RELATIVE_PATHS } from "../vendor/mikuproject/scripts/lib/core-api-loader.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const requireFromRepoRoot = createRequire(path.resolve(repoRoot, "package.json"));

const bundleRoot = path.resolve(repoRoot, "bundle/mikuproject-skills");
const bundleSkillsRoot = path.resolve(bundleRoot, "skills");
const bundledRuntimeRoot = path.resolve(
  bundleRoot,
  "skills/mikuproject/runtime"
);
const bundledCliBundleRoot = path.resolve(
  bundledRuntimeRoot,
  "mikuproject-cli-bundle"
);
const sourceSkillRoot = path.resolve(repoRoot, "skills/mikuproject");
const sourceVendorRoot = path.resolve(repoRoot, "vendor/mikuproject");
const sourceVendorPackageJsonPath = path.resolve(sourceVendorRoot, "package.json");

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
  buildBundledCliBundle();

  process.stdout.write([
    "[build:bundle] generated bundle/mikuproject-skills",
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    "  - skills/mikuproject",
    "  - skills/mikuproject/runtime/mikuproject-cli-bundle"
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}

function buildBundledCliBundle() {
  const vendorPackageJson = readJson(sourceVendorPackageJsonPath);
  const jsdomPackageJsonPath = resolveInstalledPackageJson("jsdom", requireFromRepoRoot);
  const jsdomPackageJson = readJson(jsdomPackageJsonPath);

  fs.rmSync(bundledCliBundleRoot, { recursive: true, force: true });
  fs.mkdirSync(bundledCliBundleRoot, { recursive: true });

  for (const relativePath of getCliBundleRuntimeFileRelativePaths()) {
    copyVendorFileToCliBundle(relativePath);
  }

  writeCliBundlePackageJson(vendorPackageJson, jsdomPackageJson);
  writeCliBundleReadme();
  copyCliBundleNodeModules();
}

function getCliBundleRuntimeFileRelativePaths() {
  const files = new Set([
    "scripts/mikuproject-cli.mjs",
    "scripts/lib/core-api-loader.mjs",
    ...CORE_API_MODULE_RELATIVE_PATHS
  ]);
  return Array.from(files).sort();
}

function copyVendorFileToCliBundle(relativePath) {
  const sourcePath = path.resolve(sourceVendorRoot, relativePath);
  const destinationPath = path.resolve(bundledCliBundleRoot, relativePath);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

function writeCliBundlePackageJson(vendorPackageJson, jsdomPackageJson) {
  const document = {
    name: `${vendorPackageJson.name}-cli-bundle`,
    version: vendorPackageJson.version,
    private: true,
    description: "Self-contained mikuproject CLI bundle.",
    license: vendorPackageJson.license,
    type: "module",
    bin: {
      mikuproject: "scripts/mikuproject-cli.mjs"
    },
    engines: {
      node: ">=18"
    },
    dependencies: {
      jsdom: jsdomPackageJson.version
    }
  };

  const packageJsonPath = path.resolve(bundledCliBundleRoot, "package.json");
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
}

function writeCliBundleReadme() {
  const readmePath = path.resolve(bundledCliBundleRoot, "README.md");
  const lines = [
    "# mikuproject-cli-bundle",
    "",
    "This bundle contains a self-contained `mikuproject` CLI runtime for use from the installed skill bundle.",
    "",
    "## Usage",
    "",
    "```bash",
    "node scripts/mikuproject-cli.mjs ai spec",
    "node scripts/mikuproject-cli.mjs report wbs-xlsx --in workbook.json --out report.xlsx",
    "```"
  ];
  fs.writeFileSync(readmePath, `${lines.join("\n")}\n`, "utf8");
}

function copyCliBundleNodeModules() {
  const destinationNodeModulesDir = path.resolve(bundledCliBundleRoot, "node_modules");
  fs.mkdirSync(destinationNodeModulesDir, { recursive: true });

  const visitedPackageJsonPaths = new Set();
  const queue = [{ name: "jsdom", requireFn: requireFromRepoRoot }];

  while (queue.length > 0) {
    const current = queue.shift();
    const packageJsonPath = resolveInstalledPackageJson(current.name, current.requireFn);
    if (visitedPackageJsonPaths.has(packageJsonPath)) {
      continue;
    }
    visitedPackageJsonPaths.add(packageJsonPath);

    const packageJson = readJson(packageJsonPath);
    const packageDir = path.dirname(packageJsonPath);
    const sourceNodeModulesDir = findOwningNodeModulesDir(packageDir);
    const relativePackageDir = path.relative(sourceNodeModulesDir, packageDir);
    if (relativePackageDir.startsWith("..")) {
      throw new Error(`node_modules 配下でない package を検出しました: ${packageDir}`);
    }

    const destinationPackageDir = path.resolve(destinationNodeModulesDir, relativePackageDir);
    fs.mkdirSync(path.dirname(destinationPackageDir), { recursive: true });
    fs.cpSync(packageDir, destinationPackageDir, {
      recursive: true,
      force: true,
      dereference: true
    });

    const packageRequire = createRequire(packageJsonPath);
    for (const dependencyName of Object.keys(packageJson.dependencies || {})) {
      queue.push({ name: dependencyName, requireFn: packageRequire });
    }
    for (const dependencyName of Object.keys(packageJson.optionalDependencies || {})) {
      if (!isPackageInstalled(dependencyName, packageRequire)) {
        continue;
      }
      queue.push({ name: dependencyName, requireFn: packageRequire });
    }
  }
}

function findOwningNodeModulesDir(packageDir) {
  let currentDir = packageDir;
  while (true) {
    if (path.basename(currentDir) === "node_modules") {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error(`node_modules 配下でない package を検出しました: ${packageDir}`);
    }
    currentDir = parentDir;
  }
}

function resolveInstalledPackageJson(packageName, requireFn) {
  try {
    return requireFn.resolve(`${packageName}/package.json`);
  } catch (_error) {
    try {
      const resolvedEntryPath = requireFn.resolve(packageName);
      return findNearestPackageJson(resolvedEntryPath, packageName);
    } catch (_innerError) {
      throw new Error(
        `${packageName} が見つかりません。先に repo root で npm install を実行してください`
      );
    }
  }
}

function isPackageInstalled(packageName, requireFn) {
  try {
    requireFn.resolve(`${packageName}/package.json`);
    return true;
  } catch (_error) {
    return false;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findNearestPackageJson(startPath, expectedPackageName) {
  let currentDir = path.dirname(startPath);
  while (true) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const document = readJson(packageJsonPath);
      if (document.name === expectedPackageName) {
        return packageJsonPath;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error(`package.json が見つかりません: ${expectedPackageName}`);
    }
    currentDir = parentDir;
  }
}
