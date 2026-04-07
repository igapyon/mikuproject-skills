// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { beforeEach, describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typesCode = readFileSync(
  path.resolve(__dirname, "../src/js/types.js"),
  "utf8"
);
const aiJsonUtilCode = readFileSync(
  path.resolve(__dirname, "../src/js/ai-json-util.js"),
  "utf8"
);
const aiJsonSpecCode = readFileSync(
  path.resolve(__dirname, "../src/js/ai-json-spec.js"),
  "utf8"
);
const msProjectXmlCode = readFileSync(
  path.resolve(__dirname, "../src/js/msproject-xml.js"),
  "utf8"
);
const projectWorkbookSchemaCode = readFileSync(
  path.resolve(__dirname, "../src/js/project-workbook-schema.js"),
  "utf8"
);
const projectXlsxCode = readFileSync(
  path.resolve(__dirname, "../src/js/project-xlsx.js"),
  "utf8"
);
const projectWorkbookJsonCode = readFileSync(
  path.resolve(__dirname, "../src/js/project-workbook-json.js"),
  "utf8"
);
const projectPatchJsonCode = readFileSync(
  path.resolve(__dirname, "../src/js/project-patch-json.js"),
  "utf8"
);
const coreApiCode = readFileSync(
  path.resolve(__dirname, "../src/js/core-api.js"),
  "utf8"
);
const dependencyXml = readFileSync(
  path.resolve(__dirname, "../testdata/dependency.xml"),
  "utf8"
);

function bootModules() {
  new Function([
    typesCode,
    aiJsonUtilCode,
    aiJsonSpecCode,
    msProjectXmlCode,
    projectWorkbookSchemaCode,
    projectXlsxCode,
    projectWorkbookJsonCode,
    projectPatchJsonCode,
    coreApiCode
  ].join("\n"))();
  return globalThis.__mikuprojectCoreApi;
}

describe("mikuproject core api", () => {
  beforeEach(() => {
    delete globalThis.__mikuprojectAiJsonUtil;
    delete globalThis.__mikuprojectAiJsonSpec;
    delete globalThis.__mikuprojectXml;
    delete globalThis.__mikuprojectProjectWorkbookSchema;
    delete globalThis.__mikuprojectProjectXlsx;
    delete globalThis.__mikuprojectProjectWorkbookJson;
    delete globalThis.__mikuprojectProjectPatchJson;
    delete globalThis.__mikuprojectCoreApi;
  });

  it("exposes the ai json spec through a stable function", () => {
    const api = bootModules();

    const spec = api.getAiJsonSpec();

    expect(spec.id).toBe("mikuproject-ai-json-spec");
    expect(spec.version).toBe("v20260403");
    expect(spec.text).toContain("# mikuproject AI JSON Prompt / Spec");
    expect(api.getAiJsonSpecText()).toBe(spec.text);
  });

  it("parses fenced ai json text and detects the kind", () => {
    const api = bootModules();

    const parsed = api.parseAiJsonText([
      "説明文",
      "```json",
      JSON.stringify({ view_type: "project_draft_view", project: { name: "Test" }, tasks: [] }),
      "```"
    ].join("\n"));

    expect(parsed.kind).toBe("project_draft_view");
    expect(parsed.document.view_type).toBe("project_draft_view");
  });

  it("imports project_draft_view without UI dependencies", () => {
    const api = bootModules();

    const result = api.importAiJsonDocument({
      view_type: "project_draft_view",
      project: {
        name: "API draft import",
        planned_start: "2026-04-01"
      },
      tasks: [
        { uid: "draft-1", name: "開始", parent_uid: null, position: 0, is_milestone: true, planned_start: "2026-04-01", planned_finish: "2026-04-01" }
      ],
      resources: [],
      assignments: []
    });

    expect(result.kind).toBe("project_draft_view");
    expect(result.mode).toBe("replace");
    expect(result.model.project.name).toBe("API draft import");
    expect(result.model.tasks).toHaveLength(1);
  });

  it("imports workbook json with and without a base model", () => {
    const api = bootModules();
    const baseModel = api.msProject.importFromXml(dependencyXml);
    const documentLike = api.workbookJson.exportDocument(baseModel);
    documentLike.sheets.Project.find((row) => row.Field === "Name").Value = "Core API workbook import";

    const replaceResult = api.importAiJsonDocument(documentLike);
    const mergeResult = api.importAiJsonDocument(documentLike, { baseModel });

    expect(replaceResult.kind).toBe("workbook_json");
    expect(replaceResult.mode).toBe("replace");
    expect(replaceResult.model.project.name).toBe("Core API workbook import");
    expect(mergeResult.kind).toBe("workbook_json");
    expect(mergeResult.mode).toBe("merge");
    expect(mergeResult.model.project.name).toBe("Core API workbook import");
    expect(Array.isArray(mergeResult.changes)).toBe(true);
  });

  it("applies patch json through the unified entrypoint", () => {
    const api = bootModules();
    const baseModel = api.msProject.importFromXml(dependencyXml);

    const result = api.importAiJsonDocument({
      operations: [
        {
          op: "update_project",
          fields: {
            name: "Core API patch import"
          }
        }
      ]
    }, { baseModel });

    expect(result.kind).toBe("patch_json");
    expect(result.mode).toBe("patch");
    expect(result.model.project.name).toBe("Core API patch import");
    expect(result.changes.some((change) => String(change.field).toLowerCase() === "name")).toBe(true);
  });

  it("rejects patch json when baseModel is missing", () => {
    const api = bootModules();

    expect(() => api.importAiJsonDocument({ operations: [] })).toThrow("baseModel");
  });
});
