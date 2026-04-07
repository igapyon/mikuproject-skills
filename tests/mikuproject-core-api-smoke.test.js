// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

const ROOT = process.cwd();

function readVendored(relativePath) {
  return readFileSync(path.resolve(ROOT, "vendor/mikuproject", relativePath), "utf8");
}

const typesCode = readVendored("src/js/types.js");
const aiJsonUtilCode = readVendored("src/js/ai-json-util.js");
const aiJsonSpecCode = readVendored("src/js/ai-json-spec.js");
const msProjectXmlCode = readVendored("src/js/msproject-xml.js");
const projectWorkbookSchemaCode = readVendored("src/js/project-workbook-schema.js");
const excelIoCode = readVendored("src/js/excel-io.js");
const projectXlsxCode = readVendored("src/js/project-xlsx.js");
const projectWorkbookJsonCode = readVendored("src/js/project-workbook-json.js");
const projectPatchJsonCode = readVendored("src/js/project-patch-json.js");
const coreApiCode = readVendored("src/js/core-api.js");
const dependencyXml = readVendored("testdata/dependency.xml");

function bootModules() {
  new Function([
    typesCode,
    aiJsonUtilCode,
    aiJsonSpecCode,
    msProjectXmlCode,
    projectWorkbookSchemaCode,
    excelIoCode,
    projectXlsxCode,
    projectWorkbookJsonCode,
    projectPatchJsonCode,
    coreApiCode
  ].join("\n"))();
  return globalThis.__mikuprojectCoreApi;
}

describe("mikuproject core api smoke", () => {
  beforeEach(() => {
    delete globalThis.__mikuprojectAiJsonUtil;
    delete globalThis.__mikuprojectAiJsonSpec;
    delete globalThis.__mikuprojectXml;
    delete globalThis.__mikuprojectProjectWorkbookSchema;
    delete globalThis.__mikuprojectExcelIo;
    delete globalThis.__mikuprojectProjectXlsx;
    delete globalThis.__mikuprojectProjectWorkbookJson;
    delete globalThis.__mikuprojectProjectPatchJson;
    delete globalThis.__mikuprojectCoreApi;
  });

  it("supports spec, draft, patch, workbook, and xlsx flows", () => {
    const api = bootModules();

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
  });
});
