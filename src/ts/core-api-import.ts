/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
  type ImportChange = {
    scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
    uid: string;
    label: string;
    field: string;
    before: string | number | boolean | undefined;
    after: string | number | boolean;
  };

  type ScopedWarning = {
    message: string;
    scope?: "project" | "tasks" | "resources" | "assignments" | "calendars";
    uid?: string;
    label?: string;
  };

  type AiJsonDocumentKind = "workbook_json" | "project_draft_view" | "patch_json";
  type ExternalImportFormat = "ms_project_xml" | "xlsx" | "workbook_json" | "project_draft_view" | "patch_json";
  type ExternalImportMode = "replace" | "merge" | "patch";

  type XlsxCellLike = {
    value?: string | number | boolean;
    numberFormat?: "general" | "integer" | "decimal" | "date" | "datetime" | "percent";
    horizontalAlign?: "left" | "center" | "right";
    bold?: boolean;
    fontSize?: number;
    fillColor?: string;
    border?: "thin";
  };

  type XlsxWorkbookLike = {
    sheets: Array<{
      name: string;
      columns?: Array<{ width?: number }>;
      mergedRanges?: string[];
      dataValidations?: Array<{
        type: "list";
        sqref: string;
        formula1: string;
        allowBlank?: boolean;
      }>;
      rows: Array<{
        height?: number;
        cells: XlsxCellLike[];
      }>;
    }>;
  };

  const mikuprojectCoreApiMsproject = (globalThis as typeof globalThis & {
    __mikuprojectCoreApiMsproject?: {
      msProject: {
        importFromXml: (xmlText: string) => ProjectModel;
      };
      aiViews: {
        importProjectDraftView: (draft: unknown) => ProjectModel;
      };
    };
  }).__mikuprojectCoreApiMsproject;

  if (!mikuprojectCoreApiMsproject) {
    throw new Error("mikuproject core api msproject module is not loaded");
  }

  const mikuprojectCoreApiWorkbook = (globalThis as typeof globalThis & {
    __mikuprojectCoreApiWorkbook?: {
      workbookJson: {
        importAsProjectModel: (documentLike: unknown) => {
          model: ProjectModel;
          warnings: Array<{ message: string }>;
        };
        importIntoProjectModel: (documentLike: unknown, baseModel: ProjectModel) => {
          model: ProjectModel;
          changes: ImportChange[];
          warnings: Array<{ message: string }>;
        };
      };
      xlsx: {
        decodeWorkbook: (bytes: Uint8Array) => XlsxWorkbookLike;
        importAsProjectModel: (workbook: XlsxWorkbookLike) => ProjectModel;
        importIntoProjectModel: (workbook: XlsxWorkbookLike, baseModel: ProjectModel) => ProjectModel;
        importIntoProjectModelDetailed?: (
          workbook: XlsxWorkbookLike,
          baseModel: ProjectModel
        ) => {
          model: ProjectModel;
          changes: ImportChange[];
        };
      };
      patchJson: {
        applyToProjectModel: (documentLike: unknown, baseModel: ProjectModel) => {
          model: ProjectModel;
          changes: ImportChange[];
          warnings: ScopedWarning[];
        };
      };
    };
  }).__mikuprojectCoreApiWorkbook;

  if (!mikuprojectCoreApiWorkbook) {
    throw new Error("mikuproject core api workbook module is not loaded");
  }

  const mikuprojectAiJsonUtil = (globalThis as typeof globalThis & {
    __mikuprojectAiJsonUtil?: {
      extractLastJsonBlock: (value: string) => string;
      detectJsonDocumentKind: (documentLike: unknown) => AiJsonDocumentKind | undefined;
    };
  }).__mikuprojectAiJsonUtil;

  if (!mikuprojectAiJsonUtil) {
    throw new Error("mikuproject AI JSON util module is not loaded");
  }

  const mikuprojectAiJsonSpec = (globalThis as typeof globalThis & {
    __mikuprojectAiJsonSpec?: {
      getAiJsonSpecText: () => string;
      getAiJsonSpec: () => {
        id: "mikuproject-ai-json-spec";
        version: string;
        text: string;
      };
    };
  }).__mikuprojectAiJsonSpec;

  if (!mikuprojectAiJsonSpec) {
    throw new Error("mikuproject AI JSON spec module is not loaded");
  }

  function getAiJsonSpecText(): string {
    return mikuprojectAiJsonSpec.getAiJsonSpecText();
  }

  function getAiJsonSpec(): {
    id: "mikuproject-ai-json-spec";
    version: string;
    text: string;
  } {
    return mikuprojectAiJsonSpec.getAiJsonSpec();
  }

  function detectAiJsonDocumentKind(documentLike: unknown): AiJsonDocumentKind | undefined {
    return mikuprojectAiJsonUtil.detectJsonDocumentKind(documentLike);
  }

  function parseAiJsonText(sourceText: string): {
    sourceText: string;
    jsonText: string;
    document: unknown;
    kind: AiJsonDocumentKind | undefined;
  } {
    const jsonText = mikuprojectAiJsonUtil.extractLastJsonBlock(sourceText);
    const document = JSON.parse(jsonText);
    return {
      sourceText,
      jsonText,
      document,
      kind: detectAiJsonDocumentKind(document)
    };
  }

  function importAiJsonDocument(documentLike: unknown, options: {
    baseModel?: ProjectModel;
  } = {}):
    | {
      kind: "project_draft_view";
      mode: "replace";
      model: ProjectModel;
      warnings: [];
    }
    | {
      kind: "workbook_json";
      mode: "replace";
      model: ProjectModel;
      warnings: Array<{ message: string }>;
    }
    | {
      kind: "workbook_json";
      mode: "merge";
      model: ProjectModel;
      changes: ImportChange[];
      warnings: Array<{ message: string }>;
    }
    | {
      kind: "patch_json";
      mode: "patch";
      model: ProjectModel;
      changes: ImportChange[];
      warnings: ScopedWarning[];
    } {
    const kind = detectAiJsonDocumentKind(documentLike);
    if (kind === "project_draft_view") {
      return {
        kind,
        mode: "replace",
        model: mikuprojectCoreApiMsproject.aiViews.importProjectDraftView(documentLike),
        warnings: []
      };
    }

    if (kind === "workbook_json") {
      if (options.baseModel) {
        return {
          kind,
          mode: "merge",
          ...mikuprojectCoreApiWorkbook.workbookJson.importIntoProjectModel(documentLike, options.baseModel)
        };
      }
      return {
        kind,
        mode: "replace",
        ...mikuprojectCoreApiWorkbook.workbookJson.importAsProjectModel(documentLike)
      };
    }

    if (kind === "patch_json") {
      if (!options.baseModel) {
        throw new Error("Patch JSON の適用には baseModel が必要です");
      }
      return {
        kind,
        mode: "patch",
        ...mikuprojectCoreApiWorkbook.patchJson.applyToProjectModel(documentLike, options.baseModel)
      };
    }

    throw new Error("AI JSON の format / view_type を判別できません");
  }

  function importAiJsonText(sourceText: string, options: {
    baseModel?: ProjectModel;
  } = {}): {
    sourceText: string;
    jsonText: string;
    document: unknown;
    kind: AiJsonDocumentKind | undefined;
    result: ReturnType<typeof importAiJsonDocument>;
  } {
    const parsed = parseAiJsonText(sourceText);
    return {
      ...parsed,
      result: importAiJsonDocument(parsed.document, options)
    };
  }

  type ExternalImportSource =
    | { format: "ms_project_xml"; text: string }
    | { format: "xlsx"; bytes: Uint8Array }
    | { format: "workbook_json"; document: unknown }
    | { format: "project_draft_view"; document: unknown }
    | { format: "patch_json"; document: unknown };

  function importExternal(input: {
    source: ExternalImportSource;
    mode: ExternalImportMode;
    baseModel?: ProjectModel;
  }):
    | {
      kind: "ms_project_xml";
      mode: "replace";
      model: ProjectModel;
      warnings: [];
    }
    | {
      kind: "xlsx";
      mode: "replace";
      model: ProjectModel;
      warnings: [];
    }
    | {
      kind: "xlsx";
      mode: "merge";
      model: ProjectModel;
      changes: ImportChange[];
      warnings: [];
    }
    | ReturnType<typeof importAiJsonDocument> {
    const { source, mode, baseModel } = input;

    if (source.format === "ms_project_xml") {
      if (mode !== "replace") {
        throw new Error("MS Project XML は replace import のみ対応です");
      }
      return {
        kind: "ms_project_xml",
        mode,
        model: mikuprojectCoreApiMsproject.msProject.importFromXml(source.text),
        warnings: []
      };
    }

    if (source.format === "xlsx") {
      if (mode === "patch") {
        throw new Error("XLSX は replace または merge import のみ対応です");
      }
      const workbook = mikuprojectCoreApiWorkbook.xlsx.decodeWorkbook(source.bytes);
      if (mode === "replace") {
        return {
          kind: "xlsx",
          mode,
          model: mikuprojectCoreApiWorkbook.xlsx.importAsProjectModel(workbook),
          warnings: []
        };
      }
      if (mode === "merge") {
        if (!baseModel) {
          throw new Error("XLSX merge import には baseModel が必要です");
        }
        if (typeof mikuprojectCoreApiWorkbook.xlsx.importIntoProjectModelDetailed === "function") {
          return {
            kind: "xlsx",
            mode,
            ...mikuprojectCoreApiWorkbook.xlsx.importIntoProjectModelDetailed(workbook, baseModel),
            warnings: []
          };
        }
        return {
          kind: "xlsx",
          mode,
          model: mikuprojectCoreApiWorkbook.xlsx.importIntoProjectModel(workbook, baseModel),
          changes: [],
          warnings: []
        };
      }
    }

    if (source.format === "workbook_json") {
      if (mode === "patch") {
        throw new Error("workbook JSON は patch import に対応していません");
      }
      if (mode === "merge" && !baseModel) {
        throw new Error("workbook JSON merge import には baseModel が必要です");
      }
      return importAiJsonDocument(source.document, mode === "merge" ? { baseModel } : {});
    }

    if (source.format === "project_draft_view") {
      if (mode !== "replace") {
        throw new Error("project_draft_view は replace import のみ対応です");
      }
      return importAiJsonDocument(source.document);
    }

    if (source.format === "patch_json") {
      if (mode !== "patch") {
        throw new Error("patch JSON は patch import のみ対応です");
      }
      return importAiJsonDocument(source.document, { baseModel });
    }

    throw new Error(`未対応の import format です: ${(source as { format?: string }).format || "unknown"}`);
  }

  globalThis.__mikuprojectCoreApiImport = {
    getAiJsonSpecText,
    getAiJsonSpec,
    detectAiJsonDocumentKind,
    parseAiJsonText,
    importAiJsonDocument,
    importAiJsonText,
    importExternal
  };
})();
