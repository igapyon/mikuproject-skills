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

  const mikuprojectProjectWorkbookJson = (globalThis as typeof globalThis & {
    __mikuprojectProjectWorkbookJson?: {
      exportProjectWorkbookJson: (model: ProjectModel) => unknown;
      importProjectWorkbookJsonAsProjectModel: (documentLike: unknown) => {
        model: ProjectModel;
        warnings: Array<{ message: string }>;
      };
      importProjectWorkbookJson: (documentLike: unknown, baseModel: ProjectModel) => {
        model: ProjectModel;
        changes: ImportChange[];
        warnings: Array<{ message: string }>;
      };
      validateWorkbookJsonDocument: (documentLike: unknown) => {
        document: unknown;
        warnings: Array<{ message: string }>;
      };
    };
  }).__mikuprojectProjectWorkbookJson;

  if (!mikuprojectProjectWorkbookJson) {
    throw new Error("mikuproject Project Workbook JSON module is not loaded");
  }

  const mikuprojectProjectXlsx = (globalThis as typeof globalThis & {
    __mikuprojectProjectXlsx?: {
      exportProjectWorkbook: (model: ProjectModel) => XlsxWorkbookLike;
      importProjectWorkbook: (workbook: XlsxWorkbookLike, baseModel: ProjectModel) => ProjectModel;
      importProjectWorkbookAsProjectModel: (workbook: XlsxWorkbookLike) => ProjectModel;
      importProjectWorkbookDetailed?: (workbook: XlsxWorkbookLike, baseModel: ProjectModel) => {
        model: ProjectModel;
        changes: ImportChange[];
      };
    };
  }).__mikuprojectProjectXlsx;

  if (!mikuprojectProjectXlsx) {
    throw new Error("mikuproject Project XLSX module is not loaded");
  }

  const mikuprojectExcelIo = (globalThis as typeof globalThis & {
    __mikuprojectExcelIo?: {
      XlsxWorkbookCodec: new () => {
        exportWorkbook: (workbook: XlsxWorkbookLike) => Uint8Array;
        importWorkbook: (bytes: Uint8Array) => XlsxWorkbookLike;
      };
    };
  }).__mikuprojectExcelIo;

  if (!mikuprojectExcelIo) {
    throw new Error("mikuproject Excel IO module is not loaded");
  }

  const mikuprojectProjectPatchJson = (globalThis as typeof globalThis & {
    __mikuprojectProjectPatchJson?: {
      importProjectPatchJson: (documentLike: unknown, baseModel: ProjectModel) => {
        model: ProjectModel;
        changes: ImportChange[];
        warnings: ScopedWarning[];
      };
      validatePatchDocument: (documentLike: unknown) => {
        document: unknown;
        warnings: ScopedWarning[];
      };
    };
  }).__mikuprojectProjectPatchJson;

  if (!mikuprojectProjectPatchJson) {
    throw new Error("mikuproject Project Patch JSON module is not loaded");
  }

  globalThis.__mikuprojectCoreApiWorkbook = {
    workbookJson: {
      exportDocument: mikuprojectProjectWorkbookJson.exportProjectWorkbookJson,
      validateDocument: mikuprojectProjectWorkbookJson.validateWorkbookJsonDocument,
      importAsProjectModel: mikuprojectProjectWorkbookJson.importProjectWorkbookJsonAsProjectModel,
      importIntoProjectModel: mikuprojectProjectWorkbookJson.importProjectWorkbookJson
    },
    xlsx: {
      decodeWorkbook: (bytes: Uint8Array) => new mikuprojectExcelIo.XlsxWorkbookCodec().importWorkbook(bytes),
      encodeWorkbook: (workbook: XlsxWorkbookLike) => new mikuprojectExcelIo.XlsxWorkbookCodec().exportWorkbook(workbook),
      exportWorkbook: mikuprojectProjectXlsx.exportProjectWorkbook,
      importAsProjectModel: mikuprojectProjectXlsx.importProjectWorkbookAsProjectModel,
      importIntoProjectModel: mikuprojectProjectXlsx.importProjectWorkbook,
      importIntoProjectModelDetailed: (
        workbook: XlsxWorkbookLike,
        baseModel: ProjectModel
      ): { model: ProjectModel; changes: ImportChange[] } | undefined => {
        if (typeof mikuprojectProjectXlsx.importProjectWorkbookDetailed !== "function") {
          return undefined;
        }
        return mikuprojectProjectXlsx.importProjectWorkbookDetailed(workbook, baseModel);
      }
    },
    patchJson: {
      validateDocument: mikuprojectProjectPatchJson.validatePatchDocument,
      applyToProjectModel: mikuprojectProjectPatchJson.importProjectPatchJson
    }
  };
})();
