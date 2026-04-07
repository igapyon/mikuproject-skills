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

describe("mikuproject phase b smoke", () => {
  let loaded = null;

  afterEach(() => {
    loaded?.dispose();
    loaded = null;
  });

  it("supports xml import/export, workbook import/export, and xlsx import/export", () => {
    loaded = bootModules();
    const { api } = loaded;

    const xmlImportedModel = api.msProject.importFromXml(dependencyXml);
    const xmlImportedWorkbook = api.workbookJson.exportDocument(xmlImportedModel);
    expect(xmlImportedWorkbook.format).toBe("mikuproject_workbook_json");

    const xmlExported = api.msProject.exportToXml(xmlImportedModel);
    expect(xmlExported).toContain("<Project");

    const workbookReplaced = api.workbookJson.importAsProjectModel(xmlImportedWorkbook);
    expect(workbookReplaced.model.project.name).toBe(xmlImportedModel.project.name);

    const workbookDocument = structuredClone(xmlImportedWorkbook);
    workbookDocument.sheets.Project.find((row) => row.Field === "Name").Value = "Phase B Workbook Merge";
    const workbookMerged = api.workbookJson.importIntoProjectModel(workbookDocument, xmlImportedModel);
    expect(workbookMerged.model.project.name).toBe("Phase B Workbook Merge");
    expect(Array.isArray(workbookMerged.changes)).toBe(true);

    const xlsxWorkbook = api.xlsx.exportWorkbook(xmlImportedModel);
    xlsxWorkbook.sheets
      .find((sheet) => sheet.name === "Project")
      .rows.find((row) => row.cells[0]?.value === "Name")
      .cells[1].value = "Phase B Xlsx Replace";
    const xlsxBytes = api.xlsx.encodeWorkbook(xlsxWorkbook);
    const xlsxDecoded = api.xlsx.decodeWorkbook(xlsxBytes);
    const xlsxReplacedModel = api.xlsx.importAsProjectModel(xlsxDecoded);
    const xlsxMergedModel = api.xlsx.importIntoProjectModel(xlsxDecoded, xmlImportedModel);

    expect(xlsxBytes).toBeInstanceOf(Uint8Array);
    expect(xlsxReplacedModel.project.name).toBe("Phase B Xlsx Replace");
    expect(xlsxMergedModel.project.name).toBe("Phase B Xlsx Replace");
  });
});
