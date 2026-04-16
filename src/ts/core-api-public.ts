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

  const mikuprojectCoreApiImport = (globalThis as typeof globalThis & {
    __mikuprojectCoreApiImport?: {
      getAiJsonSpecText: () => string;
      getAiJsonSpec: () => {
        id: "mikuproject-ai-json-spec";
        version: string;
        text: string;
      };
      detectAiJsonDocumentKind: (documentLike: unknown) => "workbook_json" | "project_draft_view" | "patch_json" | undefined;
      parseAiJsonText: (sourceText: string) => {
        sourceText: string;
        jsonText: string;
        document: unknown;
        kind: "workbook_json" | "project_draft_view" | "patch_json" | undefined;
      };
      importAiJsonDocument: (documentLike: unknown, options?: { baseModel?: ProjectModel }) => unknown;
      importAiJsonText: (sourceText: string, options?: { baseModel?: ProjectModel }) => unknown;
      importExternal: (input: unknown) => unknown;
    };
  }).__mikuprojectCoreApiImport;

  if (!mikuprojectCoreApiImport) {
    throw new Error("mikuproject core api import module is not loaded");
  }

  const mikuprojectCoreApiMsproject = (globalThis as typeof globalThis & {
    __mikuprojectCoreApiMsproject?: {
      samples: unknown;
      projectModel: unknown;
      msProject: unknown;
      aiViews: unknown;
    };
  }).__mikuprojectCoreApiMsproject;

  if (!mikuprojectCoreApiMsproject) {
    throw new Error("mikuproject core api msproject module is not loaded");
  }

  const mikuprojectCoreApiWorkbook = (globalThis as typeof globalThis & {
    __mikuprojectCoreApiWorkbook?: {
      workbookJson: {
        exportDocument: (model: ProjectModel) => unknown;
        validateDocument: (documentLike: unknown) => {
          document: unknown;
          warnings: Array<{ message: string }>;
        };
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
        encodeWorkbook: (workbook: XlsxWorkbookLike) => Uint8Array;
        exportWorkbook: (model: ProjectModel) => XlsxWorkbookLike;
        importAsProjectModel: (workbook: XlsxWorkbookLike) => ProjectModel;
        importIntoProjectModel: (workbook: XlsxWorkbookLike, baseModel: ProjectModel) => ProjectModel;
      };
      patchJson: {
        validateDocument: (documentLike: unknown) => {
          document: unknown;
          warnings: ScopedWarning[];
        };
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

  const mikuprojectCoreApiReportPublic = (globalThis as typeof globalThis & {
    __mikuprojectCoreApiReportPublic?: {
      report: unknown;
    };
  }).__mikuprojectCoreApiReportPublic;

  if (!mikuprojectCoreApiReportPublic) {
    throw new Error("mikuproject core api report public module is not loaded");
  }

  (globalThis as typeof globalThis & {
    __mikuprojectCoreApiPublic?: {
      version: 1;
      getAiJsonSpecText: () => string;
      getAiJsonSpec: () => {
        id: "mikuproject-ai-json-spec";
        version: string;
        text: string;
      };
      detectAiJsonDocumentKind: (documentLike: unknown) => "workbook_json" | "project_draft_view" | "patch_json" | undefined;
      parseAiJsonText: (sourceText: string) => {
        sourceText: string;
        jsonText: string;
        document: unknown;
        kind: "workbook_json" | "project_draft_view" | "patch_json" | undefined;
      };
      importAiJsonDocument: (documentLike: unknown, options?: { baseModel?: ProjectModel }) => unknown;
      importAiJsonText: (sourceText: string, options?: { baseModel?: ProjectModel }) => unknown;
      importExternal: (input: unknown) => unknown;
      samples: unknown;
      projectModel: unknown;
      msProject: unknown;
      aiViews: unknown;
      workbookJson: unknown;
      xlsx: unknown;
      patchJson: unknown;
      report: unknown;
    };
  }).__mikuprojectCoreApiPublic = {
    version: 1,
    getAiJsonSpecText: mikuprojectCoreApiImport.getAiJsonSpecText,
    getAiJsonSpec: mikuprojectCoreApiImport.getAiJsonSpec,
    detectAiJsonDocumentKind: mikuprojectCoreApiImport.detectAiJsonDocumentKind,
    parseAiJsonText: mikuprojectCoreApiImport.parseAiJsonText,
    importAiJsonDocument: mikuprojectCoreApiImport.importAiJsonDocument,
    importAiJsonText: mikuprojectCoreApiImport.importAiJsonText,
    importExternal: mikuprojectCoreApiImport.importExternal,
    samples: mikuprojectCoreApiMsproject.samples,
    projectModel: mikuprojectCoreApiMsproject.projectModel,
    msProject: mikuprojectCoreApiMsproject.msProject,
    aiViews: mikuprojectCoreApiMsproject.aiViews,
    workbookJson: mikuprojectCoreApiWorkbook.workbookJson,
    xlsx: mikuprojectCoreApiWorkbook.xlsx,
    patchJson: mikuprojectCoreApiWorkbook.patchJson,
    report: mikuprojectCoreApiReportPublic.report
  };
})();
