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

describe("mikuproject phase b smoke", () => {
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

  it("supports xml import/export, workbook import/export, and xlsx import/export", () => {
    const api = bootModules();

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
