import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");
const manualTestPath = path.resolve(ROOT, "docs/backend-switching-manual-test.md");
const developmentPath = path.resolve(ROOT, "docs/development.md");

describe("backend switching manual test documentation", () => {
  it("documents both local checkout and release tarball MCP server startup paths", () => {
    const text = fs.readFileSync(manualTestPath, "utf8");

    expect(text).toContain("local checkout 版");
    expect(text).toContain("workplace/mikuproject-mcp-devel");
    expect(text).toContain("release tarball 版");
    expect(text).toContain(
      "https://github.com/igapyon/mikuproject-mcp/releases/download/v0.1.0/igapyon-mikuproject-mcp-node-0.1.0.tgz"
    );
    expect(text).toContain("npm exec --yes");
  });

  it("keeps the backend switching policy checks visible", () => {
    const text = fs.readFileSync(manualTestPath, "utf8");

    expect(text).toContain("mikuproject.ai_spec");
    expect(text).toContain("mikuproject.state_from_draft");
    expect(text).toContain("mikuproject.report_wbs_markdown");
    expect(text).toContain("mcp-only");
    expect(text).toContain("cli-only");
    expect(text).toContain("handoff-only");
  });

  it("is linked from the development notes", () => {
    const text = fs.readFileSync(developmentPath, "utf8");

    expect(text).toContain(
      "[backend-switching-manual-test.md](./backend-switching-manual-test.md)"
    );
  });
});
