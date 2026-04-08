#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const bundleParentRoot = path.resolve(repoRoot, "bundle");
const bundleDirName = "skill-bundle";
const bundleRoot = path.resolve(bundleParentRoot, bundleDirName);
const zipPath = path.resolve(bundleParentRoot, "skill-bundle.zip");

main();

function main() {
  if (!fs.existsSync(bundleRoot)) {
    throw new Error("missing bundle/skill-bundle. run build:bundle first.");
  }

  fs.rmSync(zipPath, { force: true });

  const result = spawnSync("zip", ["-qr", zipPath, bundleDirName], {
    cwd: bundleParentRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || "zip command failed");
  }

  process.stdout.write([
    "[build:bundle:zip] generated bundle/skill-bundle.zip",
    "[build:bundle:zip] archive root:",
    "  - skill-bundle/"
  ].join("\n"));
  process.stdout.write("\n");
}
