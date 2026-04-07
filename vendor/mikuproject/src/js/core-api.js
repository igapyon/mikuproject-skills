/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
    const mikuprojectXml = globalThis.__mikuprojectXml;
    if (!mikuprojectXml) {
        throw new Error("mikuproject XML module is not loaded");
    }
    const mikuprojectAiJsonUtil = globalThis.__mikuprojectAiJsonUtil;
    if (!mikuprojectAiJsonUtil) {
        throw new Error("mikuproject AI JSON util module is not loaded");
    }
    const mikuprojectAiJsonSpec = globalThis.__mikuprojectAiJsonSpec;
    if (!mikuprojectAiJsonSpec) {
        throw new Error("mikuproject AI JSON spec module is not loaded");
    }
    const mikuprojectProjectWorkbookJson = globalThis.__mikuprojectProjectWorkbookJson;
    if (!mikuprojectProjectWorkbookJson) {
        throw new Error("mikuproject Project Workbook JSON module is not loaded");
    }
    const mikuprojectProjectPatchJson = globalThis.__mikuprojectProjectPatchJson;
    if (!mikuprojectProjectPatchJson) {
        throw new Error("mikuproject Project Patch JSON module is not loaded");
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
                model: mikuprojectXml.importProjectDraftView(documentLike),
                warnings: []
            };
        }
        if (kind === "workbook_json") {
            if (options.baseModel) {
                return {
                    kind,
                    mode: "merge",
                    ...mikuprojectProjectWorkbookJson.importProjectWorkbookJson(documentLike, options.baseModel)
                };
            }
            return {
                kind,
                mode: "replace",
                ...mikuprojectProjectWorkbookJson.importProjectWorkbookJsonAsProjectModel(documentLike)
            };
        }
        if (kind === "patch_json") {
            if (!options.baseModel) {
                throw new Error("Patch JSON の適用には baseModel が必要です");
            }
            return {
                kind,
                mode: "patch",
                ...mikuprojectProjectPatchJson.importProjectPatchJson(documentLike, options.baseModel)
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
    globalThis.__mikuprojectCoreApi = {
        version: 1,
        getAiJsonSpecText,
        getAiJsonSpec,
        detectAiJsonDocumentKind,
        parseAiJsonText,
        importAiJsonDocument,
        importAiJsonText,
        samples: {
            getSampleXml: () => mikuprojectXml.SAMPLE_XML,
            getSampleProjectDraftView: () => mikuprojectXml.SAMPLE_PROJECT_DRAFT_VIEW
        },
        projectModel: {
            normalize: mikuprojectXml.normalizeProjectModel,
            validate: mikuprojectXml.validateProjectModel
        },
        msProject: {
            parseXmlDocument: mikuprojectXml.parseXmlDocument,
            importFromXml: mikuprojectXml.importMsProjectXml,
            exportToXml: mikuprojectXml.exportMsProjectXml,
            importFromCsvParentId: mikuprojectXml.importCsvParentId,
            exportToCsvParentId: mikuprojectXml.exportCsvParentId
        },
        aiViews: {
            buildProjectDraftRequest: mikuprojectXml.buildProjectDraftRequest,
            importProjectDraftView: mikuprojectXml.importProjectDraftView,
            exportProjectOverviewView: mikuprojectXml.exportProjectOverviewView,
            exportTaskEditView: mikuprojectXml.exportTaskEditView,
            exportPhaseDetailView: mikuprojectXml.exportPhaseDetailView
        },
        workbookJson: {
            exportDocument: mikuprojectProjectWorkbookJson.exportProjectWorkbookJson,
            validateDocument: mikuprojectProjectWorkbookJson.validateWorkbookJsonDocument,
            importAsProjectModel: mikuprojectProjectWorkbookJson.importProjectWorkbookJsonAsProjectModel,
            importIntoProjectModel: mikuprojectProjectWorkbookJson.importProjectWorkbookJson
        },
        patchJson: {
            validateDocument: mikuprojectProjectPatchJson.validatePatchDocument,
            applyToProjectModel: mikuprojectProjectPatchJson.importProjectPatchJson
        }
    };
})();
