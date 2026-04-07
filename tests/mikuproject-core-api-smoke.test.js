// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadMikuprojectCoreApi } from "../vendor/mikuproject/scripts/lib/core-api-loader.mjs";

const ROOT = process.cwd();
const dependencyXml = readFileSync(path.resolve(ROOT, "vendor/mikuproject/testdata/dependency.xml"), "utf8");

function bootModules() {
  return loadMikuprojectCoreApi({
    rootDir: path.resolve(ROOT, "vendor/mikuproject")
  });
}

describe("mikuproject core api smoke", () => {
  let loaded = null;

  afterEach(() => {
    loaded?.dispose();
    loaded = null;
  });

  it("supports spec, draft, patch, workbook, xlsx, and report flows", () => {
    loaded = bootModules();
    const { api } = loaded;

    const spec = api.getAiJsonSpec();
    expect(spec.id).toBe("mikuproject-ai-json-spec");
    expect(spec.text).toContain("# mikuproject AI JSON Prompt / Spec");

    const draftResult = api.importAiJsonDocument({
      view_type: "project_draft_view",
      project: {
        name: "Smoke Draft",
        planned_start: "2026-04-01"
      },
      tasks: [
        {
          uid: "draft-1",
          name: "開始",
          parent_uid: null,
          position: 0,
          is_milestone: true,
          planned_start: "2026-04-01",
          planned_finish: "2026-04-01"
        }
      ],
      resources: [],
      assignments: []
    });
    expect(draftResult.kind).toBe("project_draft_view");
    expect(draftResult.mode).toBe("replace");

    const workbook = api.workbookJson.exportDocument(draftResult.model);
    expect(workbook.format).toBe("mikuproject_workbook_json");

    const baseModel = api.msProject.importFromXml(dependencyXml);
    const patchResult = api.importAiJsonDocument({
      operations: [
        {
          op: "update_project",
          fields: {
            name: "Smoke Patch"
          }
        }
      ]
    }, { baseModel });
    expect(patchResult.kind).toBe("patch_json");
    expect(patchResult.mode).toBe("patch");
    expect(patchResult.model.project.name).toBe("Smoke Patch");

    const xlsxWorkbook = api.xlsx.exportWorkbook(baseModel);
    xlsxWorkbook.sheets
      .find((sheet) => sheet.name === "Project")
      .rows.find((row) => row.cells[0]?.value === "Name")
      .cells[1].value = "Smoke Xlsx";

    const xlsxBytes = api.xlsx.encodeWorkbook(xlsxWorkbook);
    const xlsxReplace = api.importExternal({
      source: { format: "xlsx", bytes: xlsxBytes },
      mode: "replace"
    });
    const xlsxMerge = api.importExternal({
      source: { format: "xlsx", bytes: xlsxBytes },
      mode: "merge",
      baseModel
    });

    expect(xlsxBytes).toBeInstanceOf(Uint8Array);
    expect(xlsxReplace.kind).toBe("xlsx");
    expect(xlsxReplace.mode).toBe("replace");
    expect(xlsxReplace.model.project.name).toBe("Smoke Xlsx");
    expect(xlsxMerge.kind).toBe("xlsx");
    expect(xlsxMerge.mode).toBe("merge");
    expect(Array.isArray(xlsxMerge.changes)).toBe(true);

    const wbsWorkbook = api.report.wbsXlsx.exportWorkbook(baseModel, {
      displayDaysBeforeBaseDate: 1,
      displayDaysAfterBaseDate: 2
    });
    const wbsBytes = api.report.wbsXlsx.exportBytes(baseModel);
    const dailySvg = api.report.svg.exportDaily(baseModel, { labelMode: "list" });
    const weeklySvg = api.report.svg.exportWeekly(baseModel);
    const monthlyCalendar = api.report.svg.exportMonthlyCalendar(baseModel);
    const wbsMarkdown = api.report.wbsMarkdown.export(baseModel);
    const mermaidText = api.report.mermaid.exportGantt(baseModel);

    expect(wbsWorkbook.sheets.length).toBeGreaterThan(0);
    expect(wbsBytes).toBeInstanceOf(Uint8Array);
    expect(dailySvg).toContain("<svg");
    expect(weeklySvg).toContain("<svg");
    expect(monthlyCalendar.entries.length).toBeGreaterThan(0);
    expect(monthlyCalendar.zipBytes).toBeInstanceOf(Uint8Array);
    expect(wbsMarkdown).toContain("# WBS テーブル");
    expect(mermaidText).toContain("gantt");
  });
});
