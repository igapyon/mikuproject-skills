import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { afterEach, describe, expect, it } from "vitest";

const ROOT = process.cwd();
const buildScriptPath = path.resolve(ROOT, "scripts/build-skill-bundle.mjs");
const builtNodeRuntimePath = path.resolve(
  ROOT,
  "bundle/mikuproject-skills/skills/mikuproject/runtime/mikuproject.mjs"
);
const builtJavaRuntimePath = path.resolve(
  ROOT,
  "bundle/mikuproject-skills/skills/mikuproject/runtime/mikuproject.jar"
);
const builtJavaSourcesPath = path.resolve(
  ROOT,
  "bundle/mikuproject-skills/skills/mikuproject/runtime/mikuproject-sources.jar"
);
const builtNodeSourcesPath = path.resolve(
  ROOT,
  "bundle/mikuproject-skills/skills/mikuproject/runtime/mikuproject-sources.tgz"
);
const sourcePolicyConfigPath = path.resolve(
  ROOT,
  "skills/mikuproject/config/backend-policy.json"
);
const builtPolicyConfigPath = path.resolve(
  ROOT,
  "bundle/mikuproject-skills/skills/mikuproject/config/backend-policy.json"
);

describe("mikuproject bundle smoke", () => {
  const tempDirs = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true });
    }
  });

  it("runs bundled runtime artifacts from an isolated install tree", () => {
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

    const isolatedNodeRuntimePath = path.resolve(
      isolatedSkillRoot,
      "mikuproject/runtime/mikuproject.mjs"
    );
    const isolatedJavaRuntimePath = path.resolve(
      isolatedSkillRoot,
      "mikuproject/runtime/mikuproject.jar"
    );

    const nodeHelp = execFileSync("node", [isolatedNodeRuntimePath, "--help"], {
      cwd: tempRoot,
      encoding: "utf8"
    });
    const nodeVersion = execFileSync("node", [isolatedNodeRuntimePath, "--version"], {
      cwd: tempRoot,
      encoding: "utf8"
    });
    const javaHelp = execFileSync("java", ["-jar", isolatedJavaRuntimePath], {
      cwd: tempRoot,
      encoding: "utf8"
    });
    const javaVersion = execFileSync("java", ["-jar", isolatedJavaRuntimePath, "--version"], {
      cwd: tempRoot,
      encoding: "utf8"
    });

    expect(fs.existsSync(builtNodeRuntimePath)).toBe(true);
    expect(fs.existsSync(builtJavaRuntimePath)).toBe(true);
    expect(fs.existsSync(builtJavaSourcesPath)).toBe(true);
    expect(fs.existsSync(builtNodeSourcesPath)).toBe(true);
    expect(JSON.parse(fs.readFileSync(builtPolicyConfigPath, "utf8"))).toEqual(
      JSON.parse(fs.readFileSync(sourcePolicyConfigPath, "utf8"))
    );
    expect(nodeHelp).toContain("mikuproject report all");
    expect(nodeVersion).toMatch(/^mikuproject \d+\.\d+\.\d+/);
    expect(javaHelp).toContain("ai spec");
    expect(javaVersion).toMatch(/^mikuproject-java \d+\.\d+\.\d+/);
  });
});
