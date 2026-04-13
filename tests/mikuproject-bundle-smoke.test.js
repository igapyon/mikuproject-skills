import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { afterEach, describe, expect, it } from "vitest";

const ROOT = process.cwd();
const buildScriptPath = path.resolve(ROOT, "scripts/build-skill-bundle.mjs");
const builtCliPath = path.resolve(
  ROOT,
  "bundle/mikuproject-skills/skills/mikuproject/vendor/mikuproject/scripts/mikuproject-cli.mjs"
);

describe("mikuproject bundle smoke", () => {
  const tempDirs = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true });
    }
  });

  it("runs the bundled CLI from an isolated install tree", () => {
    execFileSync("node", [buildScriptPath], {
      cwd: ROOT,
      encoding: "utf8"
    });

    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mikuproject-bundle-test-"));
    tempDirs.push(tempRoot);

    const isolatedSkillRoot = path.resolve(tempRoot, "skills");
    fs.cpSync(path.resolve(ROOT, "bundle/mikuproject-skills/skills"), isolatedSkillRoot, {
      recursive: true
    });

    const isolatedCliPath = path.resolve(
      isolatedSkillRoot,
      "mikuproject/vendor/mikuproject/scripts/mikuproject-cli.mjs"
    );
    const output = execFileSync("node", [isolatedCliPath, "--help"], {
      cwd: tempRoot,
      encoding: "utf8"
    });

    expect(fs.existsSync(builtCliPath)).toBe(true);
    expect(output).toContain("mikuproject report all");
  });
});
