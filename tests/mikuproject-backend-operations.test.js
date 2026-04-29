import { describe, expect, it } from "vitest";

import {
  buildCliInvocation,
  getMcpToolName,
  operationCapabilities
} from "../skills/mikuproject/lib/backend-operations.mjs";

describe("mikuproject backend operation registry", () => {
  it("exposes operation capabilities for backend policy selection", () => {
    expect(operationCapabilities["spec"]).toEqual({ cli: true, mcp: true });
    expect(operationCapabilities["wbs-markdown-export"]).toEqual({ cli: true, mcp: true });
    expect(operationCapabilities["wbs-xlsx-export"]).toEqual({ cli: true, mcp: false });
  });

  it("builds Java CLI invocations for report exports", () => {
    const invocation = buildCliInvocation({
      operation: "wbs-xlsx-export",
      runtime: "java",
      inputPath: "state/workbook.json",
      outputPath: "report/wbs.xlsx"
    });

    expect(invocation).toEqual({
      command: "java",
      args: [
        "-jar",
        "skills/mikuproject/runtime/mikuproject.jar",
        "report",
        "wbs-xlsx",
        "--in",
        "state/workbook.json",
        "--out",
        "report/wbs.xlsx"
      ]
    });
  });

  it("builds Node.js CLI invocations for draft import", () => {
    const invocation = buildCliInvocation({
      operation: "draft",
      runtime: "node",
      inputPath: "state/draft.editjson",
      outputPath: "state/workbook.json"
    });

    expect(invocation).toEqual({
      command: "node",
      args: [
        "skills/mikuproject/runtime/mikuproject.mjs",
        "state",
        "from-draft",
        "--in",
        "state/draft.editjson",
        "--out",
        "state/workbook.json"
      ]
    });
  });

  it("builds CLI invocations requiring base state for patch apply", () => {
    const invocation = buildCliInvocation({
      operation: "patch",
      runtime: "java",
      statePath: "state/workbook.before.json",
      inputPath: "state/patch.editjson",
      outputPath: "state/workbook.after.json"
    });

    expect(invocation.args).toEqual([
      "-jar",
      "skills/mikuproject/runtime/mikuproject.jar",
      "state",
      "apply-patch",
      "--state",
      "state/workbook.before.json",
      "--in",
      "state/patch.editjson",
      "--out",
      "state/workbook.after.json"
    ]);
  });

  it("returns MCP tool names only for MCP-supported operations", () => {
    expect(getMcpToolName("spec")).toBe("mikuproject.ai_spec");
    expect(getMcpToolName("wbs-markdown-export")).toBe("mikuproject.report_wbs_markdown");
    expect(getMcpToolName("wbs-xlsx-export")).toBe(null);
  });
});
