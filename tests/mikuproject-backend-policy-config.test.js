import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const policyConfigPath = path.resolve(
  ROOT,
  "skills/mikuproject/config/backend-policy.json"
);

const expectedPolicies = [
  "cli-only",
  "cli-preferred",
  "mcp-only",
  "mcp-preferred",
  "handoff-only"
];

describe("mikuproject backend policy config", () => {
  it("defines the supported policy contract", () => {
    const config = JSON.parse(fs.readFileSync(policyConfigPath, "utf8"));

    expect(config.schema_version).toBe(1);
    expect(config.default_policy).toBe("cli-preferred");
    expect(config.allowed_policies).toEqual(expectedPolicies);
    expect(config.strict_policies).toEqual([
      "cli-only",
      "mcp-only",
      "handoff-only"
    ]);
    expect(config.precedence).toEqual([
      "user-request",
      "environment-policy",
      "skill-config",
      "repository-default"
    ]);
    expect(config.fallback_allowed).toEqual({
      "cli-only": false,
      "cli-preferred": true,
      "mcp-only": false,
      "mcp-preferred": true,
      "handoff-only": false
    });
  });

});
