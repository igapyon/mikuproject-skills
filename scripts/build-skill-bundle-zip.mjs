#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const bundleParentRoot = path.resolve(repoRoot, "bundle");
const bundleDirName = "mikuproject-skills";
const bundleRoot = path.resolve(bundleParentRoot, bundleDirName);
const buildDate = new Date().toISOString().slice(0, 10).replaceAll("-", "");
const zipFileName = `mikuproject-skills-${buildDate}.zip`;
const zipPath = path.resolve(bundleParentRoot, zipFileName);

main();

function main() {
  if (!fs.existsSync(bundleRoot)) {
    throw new Error("missing bundle/mikuproject-skills. run build:bundle first.");
  }

  fs.rmSync(zipPath, { force: true });

  const result = spawnSync("zip", ["-qr", zipPath, "skills"], {
    cwd: bundleRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || "zip command failed");
  }

  process.stdout.write([
    `[build:bundle:zip] generated bundle/${zipFileName}`,
    "[build:bundle:zip] archive root:",
    "  - skills/"
  ].join("\n"));
  process.stdout.write("\n");
}
