/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
    const mikuprojectCoreApiMsproject = globalThis.__mikuprojectCoreApiMsproject;
    if (!mikuprojectCoreApiMsproject) {
        throw new Error("mikuproject core api msproject module is not loaded");
    }
    const mikuprojectCoreApiWorkbook = globalThis.__mikuprojectCoreApiWorkbook;
    if (!mikuprojectCoreApiWorkbook) {
        throw new Error("mikuproject core api workbook module is not loaded");
    }
    const mikuprojectAiJsonUtil = globalThis.__mikuprojectAiJsonUtil;
    if (!mikuprojectAiJsonUtil) {
        throw new Error("mikuproject AI JSON util module is not loaded");
    }
    const mikuprojectAiJsonSpec = globalThis.__mikuprojectAiJsonSpec;
    if (!mikuprojectAiJsonSpec) {
        throw new Error("mikuproject AI JSON spec module is not loaded");
    }
    function getAiJsonSpecText() {
        return mikuprojectAiJsonSpec.getAiJsonSpecText();
    }
    function getAiJsonSpec() {
        return mikuprojectAiJsonSpec.getAiJsonSpec();
    }
    function detectAiJsonDocumentKind(documentLike) {
        return mikuprojectAiJsonUtil.detectJsonDocumentKind(documentLike);
    }
    function parseAiJsonText(sourceText) {
        const jsonText = mikuprojectAiJsonUtil.extractLastJsonBlock(sourceText);
        const document = JSON.parse(jsonText);
        return {
            sourceText,
            jsonText,
            document,
            kind: detectAiJsonDocumentKind(document)
        };
    }
    function importAiJsonDocument(documentLike, options = {}) {
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
    function importAiJsonText(sourceText, options = {}) {
        const parsed = parseAiJsonText(sourceText);
        return {
            ...parsed,
            result: importAiJsonDocument(parsed.document, options)
        };
    }
    function importExternal(input) {
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
        throw new Error(`未対応の import format です: ${source.format || "unknown"}`);
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
