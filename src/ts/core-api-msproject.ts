/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
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
      exportMermaidGantt: (model: ProjectModel) => string;
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

  globalThis.__mikuprojectCoreApiMsproject = {
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
    mermaid: {
      exportGantt: mikuprojectXml.exportMermaidGantt
    }
  };
})();
