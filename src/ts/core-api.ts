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

  const mikuprojectXml = (globalThis as typeof globalThis & {
    __mikuprojectXml?: {
      SAMPLE_XML: string;
      SAMPLE_PROJECT_DRAFT_VIEW: unknown;
      parseXmlDocument: (xmlText: string) => XMLDocument;
      importMsProjectXml: (xmlText: string) => ProjectModel;
      importCsvParentId: (csvText: string) => ProjectModel;
      exportMsProjectXml: (model: ProjectModel) => string;
      exportCsvParentId: (model: ProjectModel) => string;
      buildProjectDraftRequest: (input: {
        name: string;
        plannedStart?: string;
        goal?: string;
        teamCount?: number;
        mustHavePhases?: string[];
        mustHaveMilestones?: string[];
      }) => unknown;
      importProjectDraftView: (draft: unknown) => ProjectModel;
      exportProjectOverviewView: (model: ProjectModel) => unknown;
      exportTaskEditView: (model: ProjectModel, taskUid?: string) => unknown;
      exportPhaseDetailView: (
        model: ProjectModel,
        phaseUid?: string,
        options?: {
          mode?: "full" | "scoped";
          rootUid?: string;
          maxDepth?: number;
        }
      ) => unknown;
      normalizeProjectModel: (model: ProjectModel) => ProjectModel;
      validateProjectModel: (model: ProjectModel) => ValidationIssue[];
    };
  }).__mikuprojectXml;

  if (!mikuprojectXml) {
    throw new Error("mikuproject XML module is not loaded");
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

  (globalThis as typeof globalThis & {
    __mikuprojectCoreApi?: {
      version: 1;
      getAiJsonSpecText: () => string;
      getAiJsonSpec: () => {
        id: "mikuproject-ai-json-spec";
        version: string;
        text: string;
      };
      detectAiJsonDocumentKind: (documentLike: unknown) => AiJsonDocumentKind | undefined;
      parseAiJsonText: (sourceText: string) => {
        sourceText: string;
        jsonText: string;
        document: unknown;
        kind: AiJsonDocumentKind | undefined;
      };
      importAiJsonDocument: typeof importAiJsonDocument;
      importAiJsonText: typeof importAiJsonText;
      samples: {
        getSampleXml: () => string;
        getSampleProjectDraftView: () => unknown;
      };
      projectModel: {
        normalize: (model: ProjectModel) => ProjectModel;
        validate: (model: ProjectModel) => ValidationIssue[];
      };
      msProject: {
        parseXmlDocument: (xmlText: string) => XMLDocument;
        importFromXml: (xmlText: string) => ProjectModel;
        exportToXml: (model: ProjectModel) => string;
        importFromCsvParentId: (csvText: string) => ProjectModel;
        exportToCsvParentId: (model: ProjectModel) => string;
      };
      aiViews: {
        buildProjectDraftRequest: (input: {
          name: string;
          plannedStart?: string;
          goal?: string;
          teamCount?: number;
          mustHavePhases?: string[];
          mustHaveMilestones?: string[];
        }) => unknown;
        importProjectDraftView: (draft: unknown) => ProjectModel;
        exportProjectOverviewView: (model: ProjectModel) => unknown;
        exportTaskEditView: (model: ProjectModel, taskUid?: string) => unknown;
        exportPhaseDetailView: (
          model: ProjectModel,
          phaseUid?: string,
          options?: {
            mode?: "full" | "scoped";
            rootUid?: string;
            maxDepth?: number;
          }
        ) => unknown;
      };
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
  }).__mikuprojectCoreApi = {
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
