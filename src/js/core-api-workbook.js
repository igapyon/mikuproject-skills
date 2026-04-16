/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
    const mikuprojectProjectWorkbookJson = globalThis.__mikuprojectProjectWorkbookJson;
    if (!mikuprojectProjectWorkbookJson) {
        throw new Error("mikuproject Project Workbook JSON module is not loaded");
    }
    const mikuprojectProjectXlsx = globalThis.__mikuprojectProjectXlsx;
    if (!mikuprojectProjectXlsx) {
        throw new Error("mikuproject Project XLSX module is not loaded");
    }
    const mikuprojectExcelIo = globalThis.__mikuprojectExcelIo;
    if (!mikuprojectExcelIo) {
        throw new Error("mikuproject Excel IO module is not loaded");
    }
    const mikuprojectProjectPatchJson = globalThis.__mikuprojectProjectPatchJson;
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
            decodeWorkbook: (bytes) => new mikuprojectExcelIo.XlsxWorkbookCodec().importWorkbook(bytes),
            encodeWorkbook: (workbook) => new mikuprojectExcelIo.XlsxWorkbookCodec().exportWorkbook(workbook),
            exportWorkbook: mikuprojectProjectXlsx.exportProjectWorkbook,
            importAsProjectModel: mikuprojectProjectXlsx.importProjectWorkbookAsProjectModel,
            importIntoProjectModel: mikuprojectProjectXlsx.importProjectWorkbook,
            importIntoProjectModelDetailed: (workbook, baseModel) => {
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
