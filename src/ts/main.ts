/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
  const mikuprojectXml = (globalThis as typeof globalThis & {
    __mikuprojectXml?: {
      SAMPLE_XML: string;
      SAMPLE_PROJECT_DRAFT_VIEW: unknown;
      importMsProjectXml: (xmlText: string) => ProjectModel;
      importCsvParentId: (csvText: string) => ProjectModel;
      exportMsProjectXml: (model: ProjectModel) => string;
      exportMermaidGantt: (model: ProjectModel) => string;
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
      exportCsvParentId: (model: ProjectModel) => string;
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
      detectJsonDocumentKind: (documentLike: unknown) => "workbook_json" | "project_draft_view" | "patch_json" | undefined;
    };
  }).__mikuprojectAiJsonUtil;

  if (!mikuprojectAiJsonUtil) {
    throw new Error("mikuproject AI JSON util module is not loaded");
  }

  const mikuprojectAiJsonSpec = (globalThis as typeof globalThis & {
    __mikuprojectAiJsonSpec?: {
      getAiJsonSpecText: () => string;
    };
  }).__mikuprojectAiJsonSpec;

  const mikuprojectMainUtil = (globalThis as typeof globalThis & {
    __mikuprojectMainUtil?: {
      parseOptionalNonNegativeInteger: (raw: string) => number | undefined;
      formatTimestampCompact: (date: Date) => string;
      formatSaveStamp: (date: Date) => string;
      encodeUtf8: (value: string) => Uint8Array;
      packZipEntries: (entries: Array<{ name: string; data: Uint8Array }>) => Uint8Array;
    };
  }).__mikuprojectMainUtil;

  if (!mikuprojectMainUtil) {
    throw new Error("mikuproject main util module is not loaded");
  }

  const mikuprojectMainRender = (globalThis as typeof globalThis & {
    __mikuprojectMainRender?: {
      renderValidationIssues: (doc: Document, issues: ValidationIssue[]) => void;
      renderImportWarnings: (doc: Document, warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>, options?: { sourceLabel?: string }) => void;
      renderXlsxImportSummary: (doc: Document, changes: Array<{
        scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
        uid: string;
        label: string;
        field: string;
        before: string | number | boolean | undefined;
        after: string | number | boolean;
      }>, options?: {
        sourceLabel?: string;
        warnings?: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
      }) => void;
      updateSummary: (doc: Document, model: ProjectModel | null, updateSvgButton: () => void) => void;
    };
  }).__mikuprojectMainRender;

  if (!mikuprojectMainRender) {
    throw new Error("mikuproject main render module is not loaded");
  }

  const mikuprojectMainIo = (globalThis as typeof globalThis & {
    __mikuprojectMainIo?: {
      buildOutputArchiveEntries: (deps: {
        model: ProjectModel;
        syncXmlTextFromModel: (model: ProjectModel) => string;
        formatTimestampCompact: (date: Date) => string;
        encodeUtf8: (value: string) => Uint8Array;
        createWorkbookCodec: () => {
          exportWorkbook: (workbook: unknown) => Uint8Array;
        };
        exportProjectWorkbook: (model: ProjectModel) => unknown;
        exportProjectWorkbookJson: (model: ProjectModel) => unknown;
        exportCsvParentId: (model: ProjectModel) => string;
        buildWbsOptions: (model: ProjectModel) => {
          holidayDates: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        };
        exportWbsWorkbook: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => unknown;
        exportWbsMarkdown: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => string;
        exportNativeSvg: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => string;
        exportWeeklyNativeSvg: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => string;
        exportMonthlyWbsCalendarSvgArchive: (model: ProjectModel) => {
          entries: Array<{ fileName: string; svg: string }>;
        };
        exportMermaidGantt: (model: ProjectModel) => string;
        exportProjectOverviewView: (model: ProjectModel) => unknown;
        exportPhaseDetailView: (
          model: ProjectModel,
          phaseUid?: string,
          options?: {
            mode?: "full" | "scoped";
            rootUid?: string;
            maxDepth?: number;
          }
        ) => unknown;
        exportTaskEditView: (model: ProjectModel, taskUid?: string) => unknown;
      }) => Array<{ name: string; data: Uint8Array }>;
      detectImportKind: (input: {
        fileName: string;
        readJsonText?: string;
        extractLastJsonBlock: (value: string) => string;
        detectJsonDocumentKind: (documentLike: unknown) => "xml" | "xlsx" | "csv" | "editjson" | "workbook_json" | "project_draft_view" | "patch_json" | undefined;
      }) => "xml" | "xlsx" | "csv" | "editjson" | "workbook_json" | "project_draft_view" | "patch_json";
      assertRoundTripStable: (input: {
        currentModel: ProjectModel;
        exportMsProjectXml: (model: ProjectModel) => string;
        importMsProjectXml: (xmlText: string) => ProjectModel;
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
        normalizeProjectModel: (model: ProjectModel) => ProjectModel;
      }) => ValidationIssue[];
    };
  }).__mikuprojectMainIo;

  if (!mikuprojectMainIo) {
    throw new Error("mikuproject main IO module is not loaded");
  }

  const mikuprojectMainImport = (globalThis as typeof globalThis & {
    __mikuprojectMainImport?: {
      importProjectDraftText: (input: {
        sourceText: string;
        extractLastJsonBlock: (value: string) => string;
        importProjectDraftView: (draft: unknown) => ProjectModel;
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
      }) => { model: ProjectModel; issues: ValidationIssue[] };
      importPatchJsonText: (input: {
        sourceText: string;
        ensureCurrentModel: () => ProjectModel;
        extractLastJsonBlock: (value: string) => string;
        importProjectPatchJson: (documentLike: unknown, baseModel: ProjectModel) => {
          model: ProjectModel;
          changes: Array<{
            scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
            uid: string;
            label: string;
            field: string;
            before: string | number | boolean | undefined;
            after: string | number | boolean;
          }>;
          warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
        };
        exportMsProjectXml: (model: ProjectModel) => string;
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
      }) => {
        model: ProjectModel;
        issues: ValidationIssue[];
        changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
        warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
        regeneratedXmlText?: string;
      };
      detectAiEditJsonKind: (input: {
        sourceText: string;
        extractLastJsonBlock: (value: string) => string;
        detectJsonDocumentKind: (documentLike: unknown) => "workbook_json" | "project_draft_view" | "patch_json" | undefined;
      }) => "project_draft_view" | "patch_json";
      importWorkbookJsonText: (input: {
        sourceText: string;
        previousModel: ProjectModel | null;
        extractLastJsonBlock: (value: string) => string;
        importProjectWorkbookJsonAsProjectModel: (documentLike: unknown) => {
          model: ProjectModel;
          warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
        };
        importProjectWorkbookJson: (documentLike: unknown, baseModel: ProjectModel) => {
          model: ProjectModel;
          changes: Array<{
            scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
            uid: string;
            label: string;
            field: string;
            before: string | number | boolean | undefined;
            after: string | number | boolean;
          }>;
          warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
        };
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
      }) => {
        model: ProjectModel;
        issues: ValidationIssue[];
        changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
        warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
      };
      importXlsxBytes: (input: {
        bytes: Uint8Array;
        previousModel: ProjectModel | null;
        createWorkbookCodec: () => {
          importWorkbook: (bytes: Uint8Array) => unknown;
          importWorkbookAsync?: (bytes: Uint8Array) => Promise<unknown>;
        };
        importProjectWorkbookAsProjectModel: (workbook: unknown) => ProjectModel;
        importProjectWorkbookDetailed: (workbook: unknown, baseModel: ProjectModel) => {
          model: ProjectModel;
          changes: Array<{
            scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
            uid: string;
            label: string;
            field: string;
            before: string | number | boolean | undefined;
            after: string | number | boolean;
          }>;
        };
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
      }) => Promise<{
        model: ProjectModel;
        issues: ValidationIssue[];
        changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
      }>;
      importCsvText: (input: {
        csvText: string;
        importCsvParentId: (csvText: string) => ProjectModel;
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
      }) => { model: ProjectModel; issues: ValidationIssue[] };
    };
  }).__mikuprojectMainImport;

  if (!mikuprojectMainImport) {
    throw new Error("mikuproject main import module is not loaded");
  }

  const mikuprojectMainExport = (globalThis as typeof globalThis & {
    __mikuprojectMainExport?: {
      buildCsvExport: (input: {
        model: ProjectModel;
        exportCsvParentId: (model: ProjectModel) => string;
      }) => { fileName: string; text: string };
      buildProjectOverviewExport: (input: {
        model: ProjectModel;
        exportProjectOverviewView: (model: ProjectModel) => unknown;
      }) => { fileName: string; text: string };
      buildTaskEditExport: (input: {
        model: ProjectModel;
        requestedTaskUid?: string;
        exportTaskEditView: (model: ProjectModel, taskUid?: string) => unknown;
      }) => { fileName: string; text: string; resolvedTaskUid?: string };
      buildAiProjectionBundleExport: (input: {
        model: ProjectModel;
        exportProjectOverviewView: (model: ProjectModel) => unknown;
        exportPhaseDetailView: (
          model: ProjectModel,
          phaseUid?: string,
          options?: { mode?: "full" | "scoped"; rootUid?: string; maxDepth?: number }
        ) => unknown;
        exportTaskEditView: (model: ProjectModel, taskUid?: string) => unknown;
      }) => { fileName: string; text: string; phaseCount: number; taskCount: number };
      buildPhaseDetailExport: (input: {
        model: ProjectModel;
        mode: "full" | "scoped";
        requestedPhaseUid?: string;
        requestedRootUid?: string;
        requestedMaxDepth?: number;
        exportPhaseDetailView: (
          model: ProjectModel,
          phaseUid?: string,
          options?: { mode?: "full" | "scoped"; rootUid?: string; maxDepth?: number }
        ) => unknown;
      }) => {
        fileName: string;
        text: string;
        resolvedPhaseUid?: string;
        resolvedRootUid?: string;
        resolvedMaxDepth?: number;
        resolvedMode: "full" | "scoped";
      };
      buildXlsxExport: (input: {
        model: ProjectModel;
        createWorkbookCodec: () => { exportWorkbook: (workbook: unknown) => Uint8Array };
        exportProjectWorkbook: (model: ProjectModel) => unknown;
      }) => { fileName: string; bytes: Uint8Array };
      buildWorkbookJsonExport: (input: {
        model: ProjectModel;
        exportProjectWorkbookJson: (model: ProjectModel) => unknown;
      }) => { fileName: string; text: string };
      buildWbsXlsxExport: (input: {
        model: ProjectModel;
        options: {
          holidayDates: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        };
        createWorkbookCodec: () => { exportWorkbook: (workbook: unknown) => Uint8Array };
        exportWbsWorkbook: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => unknown;
      }) => { fileName: string; bytes: Uint8Array };
      buildXmlExport: (input: { xmlText: string }) => { fileName: string; text: string };
      buildDailySvgExport: (input: { svg: string }) => { fileName: string; text: string };
      buildWeeklySvgExport: (input: { svg: string }) => { fileName: string; text: string };
      buildMonthlySvgZipExport: (input: { zipBytes: Uint8Array }) => { fileName: string; bytes: Uint8Array };
      buildMermaidExport: (input: { mermaidText: string }) => { fileName: string; text: string };
      buildWbsMarkdownExport: (input: { markdownText: string }) => { fileName: string; text: string };
    };
  }).__mikuprojectMainExport;

  if (!mikuprojectMainExport) {
    throw new Error("mikuproject main export module is not loaded");
  }

  const mikuprojectMainEvents = (globalThis as typeof globalThis & {
    __mikuprojectMainEvents?: {
      bind: (deps: {
        document: Document;
        setStatus: (message: string) => void;
        refreshXmlSaveState: () => void;
        markXmlSourceDirty: () => void;
        getImportFileInput: () => HTMLInputElement;
        getXmlInput: () => HTMLTextAreaElement;
        loadSample: () => void;
        downloadAllOutputs: () => void;
        setSvgPreviewMode: (mode: "daily" | "weekly" | "monthly") => void;
        downloadCurrentSvg: () => Promise<void>;
        downloadCurrentWeeklySvg: () => void;
        downloadCurrentMonthlyWbsSvgZip: () => void;
        downloadCurrentMermaidMmd: () => void;
        exportCurrentCsv: () => void;
        exportCurrentProjectOverviewView: () => void;
        exportCurrentTaskEditView: () => void;
        exportCurrentAiProjectionBundle: () => void;
        loadProjectDraftSample: () => void;
        copyAiPrompt: () => Promise<void>;
        importAiEditJsonFromText: () => Promise<void>;
        exportCurrentPhaseDetailView: (mode: "full" | "scoped") => void;
        exportCurrentXlsx: () => void;
        exportCurrentWorkbookJson: () => void;
        exportCurrentWbsXlsx: () => void;
        downloadCurrentWbsMarkdown: () => void;
        downloadCurrentXml: () => void;
        runRoundTripCheck: () => void;
        importFromFile: (file: File | null | undefined) => Promise<void>;
      }) => void;
    };
  }).__mikuprojectMainEvents;

  if (!mikuprojectMainEvents) {
    throw new Error("mikuproject main events module is not loaded");
  }

  const mikuprojectMainPreview = (globalThis as typeof globalThis & {
    __mikuprojectMainPreview?: {
      createEmptyState: () => {
        currentNativeSvg: string;
        currentWeeklyPreviewSvg: string;
        currentMonthlyPreviewSvg: string;
        currentSvgPreviewMode: "daily" | "weekly" | "monthly";
      };
      renderPreviewMarkup: (state: {
        currentNativeSvg: string;
        currentWeeklyPreviewSvg: string;
        currentMonthlyPreviewSvg: string;
        currentSvgPreviewMode: "daily" | "weekly" | "monthly";
      }) => string;
      applyPreviewModeButtonClasses: (doc: Document, mode: "daily" | "weekly" | "monthly") => void;
      updateDownloadButtons: (doc: Document, hasModel: boolean) => void;
      buildRenderedState: (input: {
        model: ProjectModel | null;
        previousState: {
          currentNativeSvg: string;
          currentWeeklyPreviewSvg: string;
          currentMonthlyPreviewSvg: string;
          currentSvgPreviewMode: "daily" | "weekly" | "monthly";
        };
        buildWbsOptions: (model: ProjectModel) => {
          holidayDates: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        };
        exportNativeSvg: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => string;
        exportWeeklyNativeSvg: (
          model: ProjectModel,
          options: {
            holidayDates: string[];
            displayDaysBeforeBaseDate?: number;
            displayDaysAfterBaseDate?: number;
            useBusinessDaysForDisplayRange?: boolean;
            useBusinessDaysForProgressBand?: boolean;
          }
        ) => string;
        exportMonthlyWbsCalendarSvgArchive: (model: ProjectModel) => {
          entries: Array<{ fileName: string; svg: string }>;
        };
      }) => {
        currentNativeSvg: string;
        currentWeeklyPreviewSvg: string;
        currentMonthlyPreviewSvg: string;
        currentSvgPreviewMode: "daily" | "weekly" | "monthly";
      };
      setMode: (
        state: {
          currentNativeSvg: string;
          currentWeeklyPreviewSvg: string;
          currentMonthlyPreviewSvg: string;
          currentSvgPreviewMode: "daily" | "weekly" | "monthly";
        },
        mode: "daily" | "weekly" | "monthly"
      ) => {
        currentNativeSvg: string;
        currentWeeklyPreviewSvg: string;
        currentMonthlyPreviewSvg: string;
        currentSvgPreviewMode: "daily" | "weekly" | "monthly";
      };
    };
  }).__mikuprojectMainPreview;

  if (!mikuprojectMainPreview) {
    throw new Error("mikuproject main preview module is not loaded");
  }

  const mikuprojectMainUi = (globalThis as typeof globalThis & {
    __mikuprojectMainUi?: {
      getTabButtons: (doc: Document) => HTMLButtonElement[];
      getTabPanels: (doc: Document) => HTMLElement[];
      setStatus: (doc: Document, message: string) => void;
      updateXmlSaveState: (doc: Document, input: { isDirty: boolean; lastSavedXmlStamp: string }) => void;
      setActiveTab: (doc: Document, tabId: "input" | "transform" | "output") => void;
      moveTabFocus: (doc: Document, currentButton: HTMLButtonElement, direction: -1 | 1) => HTMLButtonElement | null;
    };
  }).__mikuprojectMainUi;

  if (!mikuprojectMainUi) {
    throw new Error("mikuproject main UI module is not loaded");
  }

  const mikuprojectMainSupport = (globalThis as typeof globalThis & {
    __mikuprojectMainSupport?: {
      showToast: (doc: Document, message: string) => void;
      getAiPromptText: (doc: Document, getSpecText?: () => string) => string;
      copyTextToClipboard: (doc: Document, text: string) => Promise<void>;
      downloadBlob: (doc: Document, blob: Blob, filename: string) => void;
    };
  }).__mikuprojectMainSupport;

  if (!mikuprojectMainSupport) {
    throw new Error("mikuproject main support module is not loaded");
  }

  const mikuprojectMainTransform = (globalThis as typeof globalThis & {
    __mikuprojectMainTransform?: {
      bindTabs: (input: {
        doc: Document;
        currentTabId: "input" | "transform" | "output";
        getTabButtons: () => HTMLButtonElement[];
        setActiveTab: (tabId: "input" | "transform" | "output") => void;
        moveTabFocus: (currentButton: HTMLButtonElement, direction: -1 | 1) => void;
      }) => void;
      buildWbsOptions: (input: {
        doc: Document;
        model: ProjectModel;
        parseOptionalNonNegativeInteger: (raw: string) => number | undefined;
        collectWbsHolidayDates: (model: ProjectModel) => string[];
      }) => {
        holidayDates: string[];
        displayDaysBeforeBaseDate?: number;
        displayDaysAfterBaseDate?: number;
        useBusinessDaysForDisplayRange?: boolean;
        useBusinessDaysForProgressBand?: boolean;
      };
      refreshTransformTab: (input: {
        currentModel: ProjectModel | null;
        isXmlSourceDirty: boolean;
        readXmlText: () => string;
        parseCurrentXml: (options?: { silent?: boolean }) => void;
        exportCurrentMermaid: (options?: { silent?: boolean }) => Promise<void>;
        setStatus: (message: string) => void;
      }) => Promise<void>;
    };
  }).__mikuprojectMainTransform;

  if (!mikuprojectMainTransform) {
    throw new Error("mikuproject main transform module is not loaded");
  }

  const mikuprojectMainFlow = (globalThis as typeof globalThis & {
    __mikuprojectMainFlow?: {
      applyModelState: (input: {
        model: ProjectModel;
        issues: ValidationIssue[];
        updateSummary: (model: ProjectModel | null) => void;
        renderValidationIssues: (issues: ValidationIssue[]) => void;
        renderImportWarnings: (warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>, options?: { sourceLabel?: string }) => void;
        renderXlsxImportSummary: (changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>, options?: {
          sourceLabel?: string;
          warnings?: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
        }) => void;
        warnings?: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
        warningSourceLabel?: string;
        changes?: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
        changeSourceLabel?: string;
      }) => void;
      completeOutput: (input: {
        setStatus: (message: string) => void;
        showToast: (message: string) => void;
        setActiveTab: (tabId: "input" | "transform" | "output", options?: { skipTransformRefresh?: boolean }) => void;
        statusMessage: string;
        toastMessage: string;
      }) => void;
      completeTransform: (input: {
        setStatus: (message: string) => void;
        showToast: (message: string) => void;
        setActiveTab: (tabId: "input" | "transform" | "output", options?: { skipTransformRefresh?: boolean }) => void;
        statusMessage: string;
        toastMessage: string;
      }) => void;
    };
  }).__mikuprojectMainFlow;

  if (!mikuprojectMainFlow) {
    throw new Error("mikuproject main flow module is not loaded");
  }

  const mikuprojectMainModel = (globalThis as typeof globalThis & {
    __mikuprojectMainModel?: {
      syncXmlTextFromModel: (input: {
        model: ProjectModel;
        exportMsProjectXml: (model: ProjectModel) => string;
        writeXmlText: (xmlText: string) => void;
        clearXmlSourceDirty: () => void;
        refreshXmlSaveState: () => void;
      }) => string;
      ensureCurrentModel: (input: {
        currentModel: ProjectModel | null;
        readXmlText: () => string;
        importMsProjectXml: (xmlText: string) => ProjectModel;
        clearXmlSourceDirty: () => void;
      }) => ProjectModel;
      parseCurrentXml: (input: {
        readXmlText: () => string;
        importMsProjectXml: (xmlText: string) => ProjectModel;
        validateProjectModel: (model: ProjectModel) => ValidationIssue[];
        clearXmlSourceDirty: () => void;
      }) => { model: ProjectModel | null; issues: ValidationIssue[]; empty: boolean };
    };
  }).__mikuprojectMainModel;

  if (!mikuprojectMainModel) {
    throw new Error("mikuproject main model module is not loaded");
  }

  const mikuprojectExcelIo = (globalThis as typeof globalThis & {
    __mikuprojectExcelIo?: {
      XlsxWorkbookCodec: new () => {
        exportWorkbook: (workbook: unknown) => Uint8Array;
        importWorkbook: (bytes: Uint8Array) => unknown;
        importWorkbookAsync?: (bytes: Uint8Array) => Promise<unknown>;
      };
    };
  }).__mikuprojectExcelIo;

  if (!mikuprojectExcelIo) {
    throw new Error("mikuproject Excel IO module is not loaded");
  }

  const mikuprojectProjectXlsx = (globalThis as typeof globalThis & {
    __mikuprojectProjectXlsx?: {
      exportProjectWorkbook: (model: ProjectModel) => unknown;
      importProjectWorkbook: (workbook: unknown, baseModel: ProjectModel) => ProjectModel;
      importProjectWorkbookAsProjectModel: (workbook: unknown) => ProjectModel;
      importProjectWorkbookDetailed: (workbook: unknown, baseModel: ProjectModel) => {
        model: ProjectModel;
        changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
      };
    };
  }).__mikuprojectProjectXlsx;

  if (!mikuprojectProjectXlsx) {
    throw new Error("mikuproject Project XLSX module is not loaded");
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
        changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
        warnings: Array<{
          message: string;
        }>;
      };
      validateWorkbookJsonDocument: (documentLike: unknown) => {
        document: unknown;
        warnings: Array<{
          message: string;
        }>;
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
        changes: Array<{
          scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
          uid: string;
          label: string;
          field: string;
          before: string | number | boolean | undefined;
          after: string | number | boolean;
        }>;
        warnings: Array<{
          message: string;
        }>;
      };
      validatePatchDocument: (documentLike: unknown) => {
        document: unknown;
        warnings: Array<{
          message: string;
        }>;
      };
    };
  }).__mikuprojectProjectPatchJson;

  if (!mikuprojectProjectPatchJson) {
    throw new Error("mikuproject Project Patch JSON module is not loaded");
  }

  const mikuprojectWbsXlsx = (globalThis as typeof globalThis & {
    __mikuprojectWbsXlsx?: {
      collectWbsHolidayDates: (model: ProjectModel) => string[];
      exportWbsWorkbook: (
        model: ProjectModel,
        options?: {
          holidayDates?: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        }
      ) => unknown;
    };
  }).__mikuprojectWbsXlsx;

  if (!mikuprojectWbsXlsx) {
    throw new Error("mikuproject WBS XLSX module is not loaded");
  }

  const mikuprojectWbsMarkdown = (globalThis as typeof globalThis & {
    __mikuprojectWbsMarkdown?: {
      exportWbsMarkdown: (
        model: ProjectModel,
        options?: {
          holidayDates?: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        }
      ) => string;
    };
  }).__mikuprojectWbsMarkdown;

  if (!mikuprojectWbsMarkdown) {
    throw new Error("mikuproject WBS Markdown module is not loaded");
  }

  const mikuprojectNativeSvg = (globalThis as typeof globalThis & {
    __mikuprojectNativeSvg?: {
      exportNativeSvg: (
        model: ProjectModel,
        options?: {
          holidayDates?: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        }
      ) => string;
      exportWeeklyNativeSvg: (
        model: ProjectModel,
        options?: {
          holidayDates?: string[];
          displayDaysBeforeBaseDate?: number;
          displayDaysAfterBaseDate?: number;
          useBusinessDaysForDisplayRange?: boolean;
          useBusinessDaysForProgressBand?: boolean;
        }
      ) => string;
      exportMonthlyWbsCalendarSvgArchive: (
        model: ProjectModel
      ) => {
        entries: Array<{
          fileName: string;
          svg: string;
        }>;
        zipBytes: Uint8Array;
      };
    };
  }).__mikuprojectNativeSvg;

  if (!mikuprojectNativeSvg) {
    throw new Error("mikuproject native SVG module is not loaded");
  }

  let currentModel: ProjectModel | null = null;
  const currentSvgPreviewState = {
    state: mikuprojectMainPreview.createEmptyState()
  };
  let lastSavedXmlText = "";
  let lastSavedXmlStamp = "";
  let currentTabId: "input" | "transform" | "output" = "input";
  let isXmlSourceDirty = true;
  let isRefreshingTransformTab = false;

  function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element not found: ${id}`);
    }
    return element as T;
  }

  function getTextArea(id: string): HTMLTextAreaElement {
    return getElement<HTMLTextAreaElement>(id);
  }

  function getInput(id: string): HTMLInputElement {
    return getElement<HTMLInputElement>(id);
  }

  function getTabButtons(): HTMLButtonElement[] {
    return mikuprojectMainUi.getTabButtons(document);
  }

  function getTabPanels(): HTMLElement[] {
    return mikuprojectMainUi.getTabPanels(document);
  }

  function setActiveTab(
    tabId: "input" | "transform" | "output",
    options: { skipTransformRefresh?: boolean } = {}
  ): void {
    currentTabId = tabId;
    mikuprojectMainUi.setActiveTab(document, tabId);
    if (tabId === "transform" && !options.skipTransformRefresh && !isRefreshingTransformTab) {
      void refreshTransformTab().catch((error) => {
        setStatus(error instanceof Error ? error.message : "Transform の更新に失敗しました");
      });
    }
  }

  async function refreshTransformTab(): Promise<void> {
    if (isRefreshingTransformTab) {
      return;
    }
    isRefreshingTransformTab = true;
    try {
      await mikuprojectMainTransform.refreshTransformTab({
        currentModel,
        isXmlSourceDirty,
        readXmlText: () => getTextArea("xmlInput").value,
        parseCurrentXml,
        exportCurrentMermaid,
        setStatus
      });
    } finally {
      isRefreshingTransformTab = false;
    }
  }

  function moveTabFocus(currentButton: HTMLButtonElement, direction: -1 | 1): void {
    const nextButton = mikuprojectMainUi.moveTabFocus(document, currentButton, direction);
    if (!nextButton) {
      return;
    }
    nextButton.focus();
    const nextTab = nextButton.dataset.tab;
    if (nextTab === "input" || nextTab === "transform" || nextTab === "output") {
      setActiveTab(nextTab);
    }
  }

  function bindTabs(): void {
    mikuprojectMainTransform.bindTabs({
      doc: document,
      currentTabId,
      getTabButtons,
      setActiveTab: (tabId) => setActiveTab(tabId),
      moveTabFocus
    });
  }

  function parseOptionalNonNegativeInteger(raw: string): number | undefined {
    return mikuprojectMainUtil.parseOptionalNonNegativeInteger(raw);
  }

  function showToast(message: string): void {
    mikuprojectMainSupport.showToast(document, message);
  }

  function getAiPromptText(): string {
    return mikuprojectMainSupport.getAiPromptText(
      document,
      mikuprojectAiJsonSpec && typeof mikuprojectAiJsonSpec.getAiJsonSpecText === "function"
        ? mikuprojectAiJsonSpec.getAiJsonSpecText
        : undefined
    );
  }

  async function copyTextToClipboard(text: string): Promise<void> {
    await mikuprojectMainSupport.copyTextToClipboard(document, text);
  }

  async function copyAiPrompt(): Promise<void> {
    const promptText = getAiPromptText();
    if (!promptText) {
      throw new Error("生成AIプロンプトが見つかりません");
    }
    await copyTextToClipboard(promptText);
    showToast("生成AIプロンプトをクリップボードにコピーしました");
    setStatus("生成AIプロンプトをクリップボードにコピーしました");
  }

  function setSvgPreviewMarkup(markup: string): void {
    getElement<HTMLElement>("nativeSvgPreview").innerHTML = markup;
  }

  function updateSvgPreviewModeButtons(): void {
    mikuprojectMainPreview.applyPreviewModeButtonClasses(document, currentSvgPreviewState.state.currentSvgPreviewMode);
  }

  function renderCurrentSvgPreviewMarkup(): void {
    setSvgPreviewMarkup(mikuprojectMainPreview.renderPreviewMarkup(currentSvgPreviewState.state));
  }

  function updateSvgButton(): void {
    mikuprojectMainPreview.updateDownloadButtons(document, Boolean(currentModel));
  }

  function buildCurrentWbsOptions(model: ProjectModel): {
    holidayDates: string[];
    displayDaysBeforeBaseDate?: number;
    displayDaysAfterBaseDate?: number;
    useBusinessDaysForDisplayRange?: boolean;
    useBusinessDaysForProgressBand?: boolean;
  } {
    return mikuprojectMainTransform.buildWbsOptions({
      doc: document,
      model,
      parseOptionalNonNegativeInteger: parseOptionalNonNegativeInteger,
      collectWbsHolidayDates: mikuprojectWbsXlsx.collectWbsHolidayDates
    });
  }

  function downloadBlob(blob: Blob, filename: string): void {
    mikuprojectMainSupport.downloadBlob(document, blob, filename);
  }

  function formatTimestampCompact(date: Date): string {
    return mikuprojectMainUtil.formatTimestampCompact(date);
  }

  async function renderSvgPreview(): Promise<void> {
    currentSvgPreviewState.state = mikuprojectMainPreview.buildRenderedState({
      model: currentModel,
      previousState: currentSvgPreviewState.state,
      buildWbsOptions: buildCurrentWbsOptions,
      exportNativeSvg: mikuprojectNativeSvg.exportNativeSvg,
      exportWeeklyNativeSvg: mikuprojectNativeSvg.exportWeeklyNativeSvg,
      exportMonthlyWbsCalendarSvgArchive: mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive
    });
    renderCurrentSvgPreviewMarkup();
    updateSvgButton();
  }

  function setSvgPreviewMode(mode: "daily" | "weekly" | "monthly"): void {
    currentSvgPreviewState.state = mikuprojectMainPreview.setMode(currentSvgPreviewState.state, mode);
    updateSvgPreviewModeButtons();
    renderCurrentSvgPreviewMarkup();
  }

  function buildCurrentOutputArchiveEntries(): Array<{ name: string; data: Uint8Array }> {
    return mikuprojectMainIo.buildOutputArchiveEntries({
      model: ensureCurrentModel(),
      syncXmlTextFromModel,
      formatTimestampCompact,
      encodeUtf8: mikuprojectMainUtil.encodeUtf8,
      createWorkbookCodec: () => new mikuprojectExcelIo.XlsxWorkbookCodec(),
      exportProjectWorkbook: mikuprojectProjectXlsx.exportProjectWorkbook,
      exportProjectWorkbookJson: mikuprojectProjectWorkbookJson.exportProjectWorkbookJson,
      exportCsvParentId: mikuprojectXml.exportCsvParentId,
      buildWbsOptions: buildCurrentWbsOptions,
      exportWbsWorkbook: mikuprojectWbsXlsx.exportWbsWorkbook,
      exportWbsMarkdown: mikuprojectWbsMarkdown.exportWbsMarkdown,
      exportNativeSvg: mikuprojectNativeSvg.exportNativeSvg,
      exportWeeklyNativeSvg: mikuprojectNativeSvg.exportWeeklyNativeSvg,
      exportMonthlyWbsCalendarSvgArchive: mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive,
      exportMermaidGantt: mikuprojectXml.exportMermaidGantt,
      exportProjectOverviewView: mikuprojectXml.exportProjectOverviewView,
      exportPhaseDetailView: mikuprojectXml.exportPhaseDetailView,
      exportTaskEditView: mikuprojectXml.exportTaskEditView
    });
  }

  function buildCurrentOutputArchive(): { fileName: string; zipBytes: Uint8Array; entryCount: number } {
    const entries = buildCurrentOutputArchiveEntries();
    const stamp = formatTimestampCompact(new Date());
    return {
      fileName: `mikuproject-all-${stamp}.zip`,
      zipBytes: mikuprojectMainUtil.packZipEntries(entries),
      entryCount: entries.length
    };
  }

  function downloadAllOutputs(): void {
    const archive = buildCurrentOutputArchive();
    downloadBlob(
      new Blob([archive.zipBytes], { type: "application/zip" }),
      archive.fileName
    );
    setStatus(`All 出力を保存しました (${archive.entryCount} 件, ZIP)`);
    showToast("All を保存しました");
    setActiveTab("output");
  }

  function setStatus(message: string): void {
    mikuprojectMainUi.setStatus(document, message);
  }

  function formatSaveStamp(date: Date): string {
    return mikuprojectMainUtil.formatSaveStamp(date);
  }

  function updateXmlSaveState(isDirty: boolean): void {
    mikuprojectMainUi.updateXmlSaveState(document, {
      isDirty,
      lastSavedXmlStamp
    });
  }

  function markXmlDirty(): void {
    updateXmlSaveState(true);
  }

  function markXmlSavedCurrent(): void {
    lastSavedXmlText = getTextArea("xmlInput").value;
    lastSavedXmlStamp = formatSaveStamp(new Date());
    updateXmlSaveState(false);
  }

  function refreshXmlSaveState(): void {
    updateXmlSaveState(getTextArea("xmlInput").value !== lastSavedXmlText);
  }

  function syncXmlTextFromModel(model: ProjectModel): string {
    return mikuprojectMainModel.syncXmlTextFromModel({
      model,
      exportMsProjectXml: mikuprojectXml.exportMsProjectXml,
      writeXmlText: (xmlText) => {
        getTextArea("xmlInput").value = xmlText;
      },
      clearXmlSourceDirty: () => {
        isXmlSourceDirty = false;
      },
      refreshXmlSaveState
    });
  }

  function renderValidationIssues(issues: ValidationIssue[]): void {
    mikuprojectMainRender.renderValidationIssues(document, issues);
  }

  function renderImportWarnings(
    warnings: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>,
    options: { sourceLabel?: string } = {}
  ): void {
    mikuprojectMainRender.renderImportWarnings(document, warnings, options);
  }

  function renderXlsxImportSummary(changes: Array<{
    scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
    uid: string;
    label: string;
    field: string;
    before: string | number | boolean | undefined;
    after: string | number | boolean;
  }>, options: {
    sourceLabel?: string;
    warnings?: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
  } = {}): void {
    mikuprojectMainRender.renderXlsxImportSummary(document, changes, options);
  }

  function updateSummary(model: ProjectModel | null): void {
    mikuprojectMainRender.updateSummary(document, model, updateSvgButton);
  }

  function loadSample(): void {
    const sampleXml = mikuprojectXml.SAMPLE_XML;
    getTextArea("xmlInput").value = sampleXml;
    currentModel = mikuprojectXml.importMsProjectXml(sampleXml);
    isXmlSourceDirty = true;
    markXmlDirty();
    mikuprojectMainFlow.applyModelState({
      model: currentModel,
      issues: mikuprojectXml.validateProjectModel(currentModel),
      updateSummary,
      renderValidationIssues,
      renderImportWarnings,
      renderXlsxImportSummary
    });
    updateSvgButton();
    setStatus("サンプル XML を読み込みました");
    setActiveTab("input");
  }

  async function importXmlFromFile(file: File | null | undefined): Promise<void> {
    if (!file) {
      return;
    }
    const xmlText = await file.text();
    getTextArea("xmlInput").value = xmlText;
    markXmlDirty();
    currentModel = mikuprojectXml.importMsProjectXml(xmlText);
    isXmlSourceDirty = false;
    const issues = mikuprojectXml.validateProjectModel(currentModel);
    mikuprojectMainFlow.applyModelState({
      model: currentModel,
      issues,
      updateSummary,
      renderValidationIssues,
      renderImportWarnings,
      renderXlsxImportSummary
    });
    mikuprojectMainFlow.completeTransform({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: issues.length > 0 ? `XML ファイルを読み込んで解析しました。検証で ${issues.length} 件の問題があります` : "XML ファイルを読み込んで解析しました",
      toastMessage: "XML を読み込んで解析しました"
    });
    await exportCurrentMermaid({ silent: true });
  }

  function ensureCurrentModel(): ProjectModel {
    currentModel = mikuprojectMainModel.ensureCurrentModel({
      currentModel,
      readXmlText: () => getTextArea("xmlInput").value,
      importMsProjectXml: mikuprojectXml.importMsProjectXml,
      clearXmlSourceDirty: () => {
        isXmlSourceDirty = false;
      }
    });
    return currentModel;
  }

  function parseCurrentXml(options: { silent?: boolean } = {}): void {
    const result = mikuprojectMainModel.parseCurrentXml({
      readXmlText: () => getTextArea("xmlInput").value,
      importMsProjectXml: mikuprojectXml.importMsProjectXml,
      validateProjectModel: mikuprojectXml.validateProjectModel,
      clearXmlSourceDirty: () => {
        isXmlSourceDirty = false;
      }
    });
    if (result.empty || !result.model) {
      setStatus("XML が空です");
      return;
    }
    currentModel = result.model;
    mikuprojectMainFlow.applyModelState({
      model: currentModel,
      issues: result.issues,
      updateSummary,
      renderValidationIssues,
      renderImportWarnings,
      renderXlsxImportSummary
    });
    if (!options.silent) {
      mikuprojectMainFlow.completeTransform({
        setStatus,
        showToast,
        setActiveTab,
        statusMessage: result.issues.length > 0 ? `XML を解析しました。検証で ${result.issues.length} 件の問題があります` : "XML を内部モデルへ変換しました",
        toastMessage: "XML を解析しました"
      });
      return;
    }
    setActiveTab("transform", { skipTransformRefresh: true });
  }

  async function exportCurrentMermaid(options: { silent?: boolean } = {}): Promise<void> {
    if (!currentModel) {
      setStatus("内部モデルがありません");
      return;
    }
    const mermaidText = mikuprojectXml.exportMermaidGantt(currentModel);
    getTextArea("mermaidOutput").value = mermaidText;
    await renderSvgPreview();
    if (!options.silent) {
      setStatus("内部モデルから Mermaid gantt を生成し、native SVG preview を更新しました");
      showToast("Mermaid を生成しました");
    }
    setActiveTab("transform", { skipTransformRefresh: true });
  }

  function exportCurrentCsv(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const exported = mikuprojectMainExport.buildCsvExport({
      model,
      exportCsvParentId: mikuprojectXml.exportCsvParentId
    });
    downloadBlob(
      new Blob([exported.text], { type: "text/csv;charset=utf-8" }),
      exported.fileName
    );
    mikuprojectMainFlow.completeOutput({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: "内部モデルから CSV + ParentID を生成して保存しました",
      toastMessage: "CSV を保存しました"
    });
  }

  function exportCurrentProjectOverviewView(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const exported = mikuprojectMainExport.buildProjectOverviewExport({
      model,
      exportProjectOverviewView: mikuprojectXml.exportProjectOverviewView
    });
    getTextArea("projectOverviewOutput").value = exported.text.trimEnd();
    downloadBlob(
      new Blob([exported.text], { type: "application/json;charset=utf-8" }),
      exported.fileName
    );
    mikuprojectMainFlow.completeOutput({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: "project_overview_view を生成して保存しました",
      toastMessage: "project_overview_view を保存しました"
    });
  }

  function exportCurrentTaskEditView(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const exported = mikuprojectMainExport.buildTaskEditExport({
      model,
      requestedTaskUid: getInput("taskEditUidInput").value.trim() || undefined,
      exportTaskEditView: mikuprojectXml.exportTaskEditView
    });
    if (exported.resolvedTaskUid) {
      getInput("taskEditUidInput").value = exported.resolvedTaskUid;
    }
    getTextArea("taskEditOutput").value = exported.text.trimEnd();
    downloadBlob(
      new Blob([exported.text], { type: "application/json;charset=utf-8" }),
      exported.fileName
    );
    mikuprojectMainFlow.completeOutput({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: "task_edit_view を生成して保存しました",
      toastMessage: "task_edit_view を保存しました"
    });
  }

  function exportCurrentAiProjectionBundle(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const exported = mikuprojectMainExport.buildAiProjectionBundleExport({
      model,
      exportProjectOverviewView: mikuprojectXml.exportProjectOverviewView,
      exportPhaseDetailView: mikuprojectXml.exportPhaseDetailView,
      exportTaskEditView: mikuprojectXml.exportTaskEditView
    });
    getTextArea("aiBundleOutput").value = exported.text.trimEnd();
    downloadBlob(
      new Blob([exported.text], { type: "application/json;charset=utf-8" }),
      exported.fileName
    );
    mikuprojectMainFlow.completeOutput({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: `AI 連携用まとめ JSON を生成して保存しました (phase_detail_view full ${exported.phaseCount} 件 / task_edit_view ${exported.taskCount} 件)`,
      toastMessage: "AI 連携用まとめ JSON を保存しました"
    });
  }

  async function importProjectDraftFromText(): Promise<void> {
    const result = mikuprojectMainImport.importProjectDraftText({
      sourceText: getTextArea("projectDraftImportInput").value,
      extractLastJsonBlock: mikuprojectAiJsonUtil.extractLastJsonBlock,
      importProjectDraftView: mikuprojectXml.importProjectDraftView,
      validateProjectModel: mikuprojectXml.validateProjectModel
    });
    currentModel = result.model;
    syncXmlTextFromModel(currentModel);
    mikuprojectMainFlow.applyModelState({
      model: currentModel,
      issues: result.issues,
      updateSummary,
      renderValidationIssues,
      renderImportWarnings,
      renderXlsxImportSummary
    });
    await exportCurrentMermaid({ silent: true });
    mikuprojectMainFlow.completeTransform({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: result.issues.length > 0 ? `project_draft_view を取り込みました。検証で ${result.issues.length} 件の問題があります` : "project_draft_view を取り込みました",
      toastMessage: "project_draft_view を取り込みました"
    });
  }

  async function importPatchJsonFromSourceText(sourceText: string): Promise<void> {
    const result = mikuprojectMainImport.importPatchJsonText({
      sourceText,
      ensureCurrentModel,
      extractLastJsonBlock: mikuprojectAiJsonUtil.extractLastJsonBlock,
      importProjectPatchJson: mikuprojectProjectPatchJson.importProjectPatchJson,
      exportMsProjectXml: mikuprojectXml.exportMsProjectXml,
      validateProjectModel: mikuprojectXml.validateProjectModel
    });
    currentModel = result.model;
    mikuprojectMainFlow.applyModelState({
      model: currentModel,
      issues: result.issues,
      updateSummary,
      renderValidationIssues,
      renderImportWarnings,
      renderXlsxImportSummary,
      warnings: result.warnings,
      warningSourceLabel: "Patch JSON",
      changes: result.changes,
      changeSourceLabel: "Patch JSON"
    });
    if (result.regeneratedXmlText) {
      getTextArea("xmlInput").value = result.regeneratedXmlText;
      markXmlDirty();
    }
    isXmlSourceDirty = false;
    const summaryText = result.changes.length > 0
      ? `Patch JSON を読み込んで ${result.changes.length} 件の変更を反映しました。XML は再生成済みで、必要なら XML Export で保存できます`
      : "Patch JSON に反映対象の変更はありませんでした。XML は未変更です";
    const warningText = result.warnings.length > 0 ? `。Patch JSON 取込で ${result.warnings.length} 件の warning を無視しました` : "";
    mikuprojectMainFlow.completeTransform({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: result.issues.length > 0 ? `${summaryText}${warningText}。検証で ${result.issues.length} 件の問題があります` : `${summaryText}${warningText}`,
      toastMessage: "Patch JSON を反映しました"
    });
    await exportCurrentMermaid({ silent: true });
  }

  async function importAiEditJsonFromText(): Promise<void> {
    const sourceText = getTextArea("projectDraftImportInput").value;
    const kind = mikuprojectMainImport.detectAiEditJsonKind({
      sourceText,
      extractLastJsonBlock: mikuprojectAiJsonUtil.extractLastJsonBlock,
      detectJsonDocumentKind: mikuprojectAiJsonUtil.detectJsonDocumentKind
    });
    if (kind === "project_draft_view") {
      await importProjectDraftFromText();
      return;
    }
    await importPatchJsonFromSourceText(sourceText);
  }

  function loadProjectDraftSample(): void {
    const sampleDraftText = JSON.stringify(mikuprojectXml.SAMPLE_PROJECT_DRAFT_VIEW, null, 2);
    getTextArea("projectDraftImportInput").value = sampleDraftText;
    setStatus("サンプル project_draft_view を読み込みました");
    setActiveTab("input");
  }

  async function importProjectDraftFromFile(file?: File | null): Promise<void> {
    if (!file) {
      throw new Error("project_draft_view JSON ファイルを選択してください");
    }
    const sourceText = await file.text();
    getTextArea("projectDraftImportInput").value = sourceText;
    await importProjectDraftFromText();
  }

  async function importWorkbookJsonFromSourceText(sourceText: string): Promise<void> {
    const result = mikuprojectMainImport.importWorkbookJsonText({
      sourceText,
      previousModel: currentModel,
      extractLastJsonBlock: mikuprojectAiJsonUtil.extractLastJsonBlock,
      importProjectWorkbookJsonAsProjectModel: mikuprojectProjectWorkbookJson.importProjectWorkbookJsonAsProjectModel,
      importProjectWorkbookJson: mikuprojectProjectWorkbookJson.importProjectWorkbookJson,
      validateProjectModel: mikuprojectXml.validateProjectModel
    });
    currentModel = result.model;
    syncXmlTextFromModel(currentModel);
    mikuprojectMainFlow.applyModelState({
      model: currentModel,
      issues: result.issues,
      updateSummary,
      renderValidationIssues,
      renderImportWarnings,
      renderXlsxImportSummary,
      warnings: result.warnings,
      warningSourceLabel: "JSON Replace",
      changes: result.changes,
      changeSourceLabel: "JSON Replace"
    });
    const summaryText = "JSON を読み込んで project 全体を置き換えました。XML は再生成済みで、必要なら XML Export で保存できます";
    const warningText = result.warnings.length > 0 ? `。JSON 取込で ${result.warnings.length} 件の warning を無視しました` : "";
    mikuprojectMainFlow.completeTransform({
      setStatus,
      showToast,
      setActiveTab,
      statusMessage: result.issues.length > 0 ? `${summaryText}${warningText}。検証で ${result.issues.length} 件の問題があります` : `${summaryText}${warningText}`,
      toastMessage: "JSON を読み込みました"
    });
    await exportCurrentMermaid({ silent: true });
  }

  async function importWorkbookJsonFromFile(file?: File | null): Promise<void> {
    if (!file) {
      throw new Error("workbook JSON ファイルを選択してください");
    }
    const sourceText = await file.text();
    await importWorkbookJsonFromSourceText(sourceText);
  }

  async function importFromFile(file: File | null | undefined): Promise<void> {
    if (!file) {
      return;
    }
    const sourceText = file.name.toLowerCase().endsWith(".json") || file.name.toLowerCase().endsWith(".editjson")
      ? await file.text()
      : undefined;
    const kind = mikuprojectMainIo.detectImportKind({
      fileName: file.name,
      readJsonText: sourceText,
      extractLastJsonBlock: mikuprojectAiJsonUtil.extractLastJsonBlock,
      detectJsonDocumentKind: mikuprojectAiJsonUtil.detectJsonDocumentKind
    });
    if (kind === "xml") {
      await importXmlFromFile(file);
      return;
    }
    if (kind === "xlsx") {
      await importXlsxFromFile(file);
      return;
    }
    if (kind === "csv") {
      await importCsvFromFile(file);
      return;
    }
    if (kind === "editjson") {
      getTextArea("projectDraftImportInput").value = sourceText;
      await importAiEditJsonFromText();
      return;
    }
    if (kind === "workbook_json") {
      await importWorkbookJsonFromSourceText(sourceText);
      return;
    }
    if (kind === "project_draft_view") {
      getTextArea("projectDraftImportInput").value = sourceText;
      await importProjectDraftFromText();
      return;
    }
    getTextArea("projectDraftImportInput").value = sourceText;
    await importPatchJsonFromSourceText(sourceText);
  }

  function exportCurrentPhaseDetailView(mode: "full" | "scoped" = "scoped"): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const requestedPhaseUid = getInput("phaseDetailUidInput").value.trim() || undefined;
    const requestedRootUid = mode === "scoped" ? getInput("phaseDetailRootUidInput").value.trim() || undefined : undefined;
    const maxDepthText = getInput("phaseDetailMaxDepthInput").value.trim();
    const requestedMaxDepth = mode === "scoped" && maxDepthText !== "" ? Number.parseInt(maxDepthText, 10) : undefined;
    if (typeof requestedMaxDepth === "number" && (!Number.isFinite(requestedMaxDepth) || requestedMaxDepth < 0)) {
      throw new Error("max depth は 0 以上の整数で指定してください");
    }
    const exported = mikuprojectMainExport.buildPhaseDetailExport({
      model,
      mode,
      requestedPhaseUid,
      requestedRootUid,
      requestedMaxDepth,
      exportPhaseDetailView: mikuprojectXml.exportPhaseDetailView
    });
    if (exported.resolvedPhaseUid) {
      getInput("phaseDetailUidInput").value = exported.resolvedPhaseUid;
    }
    getInput("phaseDetailRootUidInput").value = exported.resolvedRootUid || "";
    getInput("phaseDetailMaxDepthInput").value = typeof exported.resolvedMaxDepth === "number" ? String(exported.resolvedMaxDepth) : "";
    getTextArea("phaseDetailOutput").value = exported.text.trimEnd();
    downloadBlob(
      new Blob([exported.text], { type: "application/json;charset=utf-8" }),
      exported.fileName
    );
    setStatus(`phase_detail_view (${exported.resolvedMode}) を生成して保存しました`);
    showToast(`phase_detail_view (${exported.resolvedMode}) を保存しました`);
    setActiveTab("output");
  }

  function exportCurrentXlsx(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const exported = mikuprojectMainExport.buildXlsxExport({
      model,
      createWorkbookCodec: () => new mikuprojectExcelIo.XlsxWorkbookCodec(),
      exportProjectWorkbook: mikuprojectProjectXlsx.exportProjectWorkbook
    });
    downloadBlob(
      new Blob([exported.bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      exported.fileName
    );
    setStatus("XLSX ファイルをエクスポートしました");
    showToast("XLSX を保存しました");
    setActiveTab("output");
  }

  function exportCurrentWorkbookJson(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const exported = mikuprojectMainExport.buildWorkbookJsonExport({
      model,
      exportProjectWorkbookJson: mikuprojectProjectWorkbookJson.exportProjectWorkbookJson
    });
    getTextArea("workbookJsonOutput").value = exported.text;
    downloadBlob(
      new Blob([`${exported.text}\n`], { type: "application/json;charset=utf-8" }),
      exported.fileName
    );
    setStatus("XLSX 相当の workbook JSON を生成して保存しました");
    showToast("JSON を保存しました");
    setActiveTab("output");
  }

  function exportCurrentWbsXlsx(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const options = buildCurrentWbsOptions(model);
    const exported = mikuprojectMainExport.buildWbsXlsxExport({
      model,
      options,
      createWorkbookCodec: () => new mikuprojectExcelIo.XlsxWorkbookCodec(),
      exportWbsWorkbook: mikuprojectWbsXlsx.exportWbsWorkbook
    });
    downloadBlob(
      new Blob([exported.bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      exported.fileName
    );
    const displayRangeText = options.displayDaysBeforeBaseDate !== undefined || options.displayDaysAfterBaseDate !== undefined
      ? ` / 表示期間 営業日 基準日前 ${options.displayDaysBeforeBaseDate || 0} 日, 基準日後 ${options.displayDaysAfterBaseDate || 0} 日`
      : "";
    const progressBandText = " / 進捗帯 営業日";
    setStatus(`WBS XLSX ファイルをエクスポートしました${options.holidayDates.length > 0 ? ` (祝日 ${options.holidayDates.length} 件)` : ""}${displayRangeText}${progressBandText}`);
    showToast("WBS XLSX を保存しました");
    setActiveTab("output");
  }

  async function importXlsxFromFile(file: File | null | undefined): Promise<void> {
    if (!file) {
      return;
    }
    const result = await mikuprojectMainImport.importXlsxBytes({
      bytes: new Uint8Array(await file.arrayBuffer()),
      previousModel: currentModel,
      createWorkbookCodec: () => new mikuprojectExcelIo.XlsxWorkbookCodec(),
      importProjectWorkbookAsProjectModel: mikuprojectProjectXlsx.importProjectWorkbookAsProjectModel,
      importProjectWorkbookDetailed: mikuprojectProjectXlsx.importProjectWorkbookDetailed,
      validateProjectModel: mikuprojectXml.validateProjectModel
    });
    currentModel = result.model;
    syncXmlTextFromModel(currentModel);
    updateSummary(currentModel);
    renderValidationIssues(result.issues);
    renderImportWarnings([]);
    renderXlsxImportSummary(result.changes, { sourceLabel: "XLSX Replace" });
    const summaryText = "XLSX を読み込んで project 全体を置き換えました。XML は再生成済みで、必要なら XML Export で保存できます";
    setStatus(result.issues.length > 0 ? `${summaryText}。検証で ${result.issues.length} 件の問題があります` : summaryText);
    showToast("XLSX を読み込みました");
    setActiveTab("transform", { skipTransformRefresh: true });
    await exportCurrentMermaid({ silent: true });
  }

  async function importCsvFromFile(file: File | null | undefined): Promise<void> {
    if (!file) {
      return;
    }
    const result = mikuprojectMainImport.importCsvText({
      csvText: await file.text(),
      importCsvParentId: mikuprojectXml.importCsvParentId,
      validateProjectModel: mikuprojectXml.validateProjectModel
    });
    currentModel = result.model;
    isXmlSourceDirty = false;
    updateSummary(currentModel);
    renderValidationIssues(result.issues);
    renderImportWarnings([]);
    renderXlsxImportSummary([]);
    setStatus(result.issues.length > 0 ? `CSV ファイルを読み込んで解析しました。検証で ${result.issues.length} 件の問題があります` : "CSV + ParentID を内部モデルへ変換しました");
    showToast("CSV を読み込みました");
    setActiveTab("transform", { skipTransformRefresh: true });
    await exportCurrentMermaid({ silent: true });
  }

  function downloadCurrentXml(): void {
    const model = ensureCurrentModel();
    const exported = mikuprojectMainExport.buildXmlExport({
      xmlText: syncXmlTextFromModel(model)
    });
    const blob = new Blob([exported.text], { type: "application/xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = exported.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    markXmlSavedCurrent();
    setStatus("XML ファイルをエクスポートしました");
    showToast("XML を保存しました");
    setActiveTab("output");
  }

  async function downloadCurrentSvg(): Promise<void> {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const mermaidText = mikuprojectXml.exportMermaidGantt(model);
    getTextArea("mermaidOutput").value = mermaidText;
    await renderSvgPreview();
    if (!currentSvgPreviewState.state.currentNativeSvg) {
      setStatus("出力する SVG がありません");
      return;
    }
    const exported = mikuprojectMainExport.buildDailySvgExport({ svg: currentSvgPreviewState.state.currentNativeSvg });
    downloadBlob(
      new Blob([exported.text], { type: "image/svg+xml;charset=utf-8" }),
      exported.fileName
    );
    setStatus("Daily SVG を保存しました");
    showToast("Daily SVG を保存しました");
    setActiveTab("output");
  }

  function downloadCurrentWeeklySvg(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const weeklySvg = mikuprojectNativeSvg.exportWeeklyNativeSvg(model, buildCurrentWbsOptions(model));
    if (!weeklySvg) {
      setStatus("出力する Weekly SVG がありません");
      return;
    }
    const exported = mikuprojectMainExport.buildWeeklySvgExport({ svg: weeklySvg });
    downloadBlob(
      new Blob([exported.text], { type: "image/svg+xml;charset=utf-8" }),
      exported.fileName
    );
    setStatus("Weekly SVG を保存しました");
    showToast("Weekly SVG を保存しました");
    setActiveTab("output");
  }

  function downloadCurrentMonthlyWbsSvgZip(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const archive = mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive(model);
    if (!archive.entries.length || archive.zipBytes.byteLength === 0) {
      throw new Error("出力する月別 WBS カレンダー SVG がありません");
    }
    const exported = mikuprojectMainExport.buildMonthlySvgZipExport({ zipBytes: archive.zipBytes });
    downloadBlob(
      new Blob([exported.bytes], { type: "application/zip" }),
      exported.fileName
    );
    setStatus(`Monthly Calendar SVG を保存しました (${archive.entries.length} か月分, ZIP)`);
    showToast("Monthly Calendar SVG を保存しました");
    setActiveTab("output");
  }

  function downloadCurrentMermaidMmd(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const mermaidText = mikuprojectXml.exportMermaidGantt(model);
    getTextArea("mermaidOutput").value = mermaidText;
    const exported = mikuprojectMainExport.buildMermaidExport({ mermaidText });
    downloadBlob(
      new Blob([exported.text], { type: "text/plain;charset=utf-8" }),
      exported.fileName
    );
    setStatus("Mermaid を保存しました");
    showToast("Mermaid を保存しました");
    setActiveTab("output");
  }

  function downloadCurrentWbsMarkdown(): void {
    const model = ensureCurrentModel();
    syncXmlTextFromModel(model);
    const options = buildCurrentWbsOptions(model);
    const markdownText = mikuprojectWbsMarkdown.exportWbsMarkdown(model, options);
    const exported = mikuprojectMainExport.buildWbsMarkdownExport({ markdownText });
    downloadBlob(
      new Blob([exported.text], { type: "text/markdown;charset=utf-8" }),
      exported.fileName
    );
    setStatus("WBS Markdown を保存しました");
    showToast("WBS Markdown を保存しました");
    setActiveTab("output");
  }

  function runRoundTripCheck(): void {
    if (!currentModel) {
      parseCurrentXml();
      if (!currentModel) {
        return;
      }
    }
    const validationIssues = mikuprojectMainIo.assertRoundTripStable({
      currentModel,
      exportMsProjectXml: mikuprojectXml.exportMsProjectXml,
      importMsProjectXml: mikuprojectXml.importMsProjectXml,
      validateProjectModel: mikuprojectXml.validateProjectModel,
      normalizeProjectModel: mikuprojectXml.normalizeProjectModel
    });
    renderValidationIssues(validationIssues);
    setStatus("再読込テストに成功しました");
    showToast("再読込テスト成功");
    setActiveTab("transform");
  }

  function bindEvents(): void {
    mikuprojectMainEvents.bind({
      document,
      setStatus,
      refreshXmlSaveState,
      markXmlSourceDirty: () => {
        isXmlSourceDirty = true;
      },
      getImportFileInput: () => getElement<HTMLInputElement>("importFileInput"),
      getXmlInput: () => getTextArea("xmlInput"),
      loadSample,
      downloadAllOutputs,
      setSvgPreviewMode,
      downloadCurrentSvg,
      downloadCurrentWeeklySvg,
      downloadCurrentMonthlyWbsSvgZip,
      downloadCurrentMermaidMmd,
      exportCurrentCsv,
      exportCurrentProjectOverviewView,
      exportCurrentTaskEditView,
      exportCurrentAiProjectionBundle,
      loadProjectDraftSample,
      copyAiPrompt,
      importAiEditJsonFromText,
      exportCurrentPhaseDetailView,
      exportCurrentXlsx,
      exportCurrentWorkbookJson,
      exportCurrentWbsXlsx,
      downloadCurrentWbsMarkdown,
      downloadCurrentXml,
      runRoundTripCheck,
      importFromFile
    });
  }

  function initialize(): void {
    bindTabs();
    bindEvents();
    updateSummary(null);
    renderValidationIssues([]);
    renderImportWarnings([]);
    renderXlsxImportSummary([]);
    updateSvgPreviewModeButtons();
    updateSvgButton();
    loadSample();
  }

  (globalThis as typeof globalThis & {
    __mikuprojectMainTestHooks?: {
      parseCurrentXml: () => void;
      buildCurrentOutputArchiveEntries: () => Array<{ name: string; data: Uint8Array }>;
      importFromFile: (file: File | null | undefined) => Promise<void>;
      runRoundTripCheck: () => void;
      exportCurrentMermaid: () => Promise<void>;
      renderValidationIssues: (issues: ValidationIssue[]) => void;
      renderXlsxImportSummary: (changes: Array<{
        scope: "project" | "tasks" | "resources" | "assignments" | "calendars";
        uid: string;
        label: string;
        field: string;
        before: string | number | boolean | undefined;
        after: string | number | boolean;
      }>, options?: {
        sourceLabel?: string;
        warnings?: Array<{ message: string; scope?: "project" | "tasks" | "resources" | "assignments" | "calendars"; uid?: string; label?: string }>;
      }) => void;
    };
  }).__mikuprojectMainTestHooks = {
    parseCurrentXml,
    buildCurrentOutputArchiveEntries,
    importFromFile,
    runRoundTripCheck,
    exportCurrentMermaid,
    renderValidationIssues,
    renderXlsxImportSummary
  };

  document.addEventListener("DOMContentLoaded", initialize);
})();
