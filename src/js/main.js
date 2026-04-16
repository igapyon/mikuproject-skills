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
    const mikuprojectMainUtil = globalThis.__mikuprojectMainUtil;
    if (!mikuprojectMainUtil) {
        throw new Error("mikuproject main util module is not loaded");
    }
    const mikuprojectMainRender = globalThis.__mikuprojectMainRender;
    if (!mikuprojectMainRender) {
        throw new Error("mikuproject main render module is not loaded");
    }
    const mikuprojectMainIo = globalThis.__mikuprojectMainIo;
    if (!mikuprojectMainIo) {
        throw new Error("mikuproject main IO module is not loaded");
    }
    const mikuprojectMainImport = globalThis.__mikuprojectMainImport;
    if (!mikuprojectMainImport) {
        throw new Error("mikuproject main import module is not loaded");
    }
    const mikuprojectMainExport = globalThis.__mikuprojectMainExport;
    if (!mikuprojectMainExport) {
        throw new Error("mikuproject main export module is not loaded");
    }
    const mikuprojectMainEvents = globalThis.__mikuprojectMainEvents;
    if (!mikuprojectMainEvents) {
        throw new Error("mikuproject main events module is not loaded");
    }
    const mikuprojectMainPreview = globalThis.__mikuprojectMainPreview;
    if (!mikuprojectMainPreview) {
        throw new Error("mikuproject main preview module is not loaded");
    }
    const mikuprojectMainUi = globalThis.__mikuprojectMainUi;
    if (!mikuprojectMainUi) {
        throw new Error("mikuproject main UI module is not loaded");
    }
    const mikuprojectMainSupport = globalThis.__mikuprojectMainSupport;
    if (!mikuprojectMainSupport) {
        throw new Error("mikuproject main support module is not loaded");
    }
    const mikuprojectMainTransform = globalThis.__mikuprojectMainTransform;
    if (!mikuprojectMainTransform) {
        throw new Error("mikuproject main transform module is not loaded");
    }
    const mikuprojectMainFlow = globalThis.__mikuprojectMainFlow;
    if (!mikuprojectMainFlow) {
        throw new Error("mikuproject main flow module is not loaded");
    }
    const mikuprojectMainModel = globalThis.__mikuprojectMainModel;
    if (!mikuprojectMainModel) {
        throw new Error("mikuproject main model module is not loaded");
    }
    const mikuprojectExcelIo = globalThis.__mikuprojectExcelIo;
    if (!mikuprojectExcelIo) {
        throw new Error("mikuproject Excel IO module is not loaded");
    }
    const mikuprojectProjectXlsx = globalThis.__mikuprojectProjectXlsx;
    if (!mikuprojectProjectXlsx) {
        throw new Error("mikuproject Project XLSX module is not loaded");
    }
    const mikuprojectProjectWorkbookJson = globalThis.__mikuprojectProjectWorkbookJson;
    if (!mikuprojectProjectWorkbookJson) {
        throw new Error("mikuproject Project Workbook JSON module is not loaded");
    }
    const mikuprojectProjectPatchJson = globalThis.__mikuprojectProjectPatchJson;
    if (!mikuprojectProjectPatchJson) {
        throw new Error("mikuproject Project Patch JSON module is not loaded");
    }
    const mikuprojectWbsXlsx = globalThis.__mikuprojectWbsXlsx;
    if (!mikuprojectWbsXlsx) {
        throw new Error("mikuproject WBS XLSX module is not loaded");
    }
    const mikuprojectWbsMarkdown = globalThis.__mikuprojectWbsMarkdown;
    if (!mikuprojectWbsMarkdown) {
        throw new Error("mikuproject WBS Markdown module is not loaded");
    }
    const mikuprojectNativeSvg = globalThis.__mikuprojectNativeSvg;
    if (!mikuprojectNativeSvg) {
        throw new Error("mikuproject native SVG module is not loaded");
    }
    let currentModel = null;
    const currentSvgPreviewState = {
        state: mikuprojectMainPreview.createEmptyState()
    };
    let lastSavedXmlText = "";
    let lastSavedXmlStamp = "";
    let currentTabId = "input";
    let isXmlSourceDirty = true;
    let isRefreshingTransformTab = false;
    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element not found: ${id}`);
        }
        return element;
    }
    function getTextArea(id) {
        return getElement(id);
    }
    function getInput(id) {
        return getElement(id);
    }
    function getTabButtons() {
        return mikuprojectMainUi.getTabButtons(document);
    }
    function getTabPanels() {
        return mikuprojectMainUi.getTabPanels(document);
    }
    function setActiveTab(tabId, options = {}) {
        currentTabId = tabId;
        mikuprojectMainUi.setActiveTab(document, tabId);
        if (tabId === "transform" && !options.skipTransformRefresh && !isRefreshingTransformTab) {
            void refreshTransformTab().catch((error) => {
                setStatus(error instanceof Error ? error.message : "Transform の更新に失敗しました");
            });
        }
    }
    async function refreshTransformTab() {
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
        }
        finally {
            isRefreshingTransformTab = false;
        }
    }
    function moveTabFocus(currentButton, direction) {
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
    function bindTabs() {
        mikuprojectMainTransform.bindTabs({
            doc: document,
            currentTabId,
            getTabButtons,
            setActiveTab: (tabId) => setActiveTab(tabId),
            moveTabFocus
        });
    }
    function parseOptionalNonNegativeInteger(raw) {
        return mikuprojectMainUtil.parseOptionalNonNegativeInteger(raw);
    }
    function showToast(message) {
        mikuprojectMainSupport.showToast(document, message);
    }
    function getAiPromptText() {
        return mikuprojectMainSupport.getAiPromptText(document, mikuprojectAiJsonSpec && typeof mikuprojectAiJsonSpec.getAiJsonSpecText === "function"
            ? mikuprojectAiJsonSpec.getAiJsonSpecText
            : undefined);
    }
    async function copyTextToClipboard(text) {
        await mikuprojectMainSupport.copyTextToClipboard(document, text);
    }
    async function copyAiPrompt() {
        const promptText = getAiPromptText();
        if (!promptText) {
            throw new Error("生成AIプロンプトが見つかりません");
        }
        await copyTextToClipboard(promptText);
        showToast("生成AIプロンプトをクリップボードにコピーしました");
        setStatus("生成AIプロンプトをクリップボードにコピーしました");
    }
    function setSvgPreviewMarkup(markup) {
        getElement("nativeSvgPreview").innerHTML = markup;
    }
    function updateSvgPreviewModeButtons() {
        mikuprojectMainPreview.applyPreviewModeButtonClasses(document, currentSvgPreviewState.state.currentSvgPreviewMode);
    }
    function renderCurrentSvgPreviewMarkup() {
        setSvgPreviewMarkup(mikuprojectMainPreview.renderPreviewMarkup(currentSvgPreviewState.state));
    }
    function updateSvgButton() {
        mikuprojectMainPreview.updateDownloadButtons(document, Boolean(currentModel));
    }
    function buildCurrentWbsOptions(model) {
        return mikuprojectMainTransform.buildWbsOptions({
            doc: document,
            model,
            parseOptionalNonNegativeInteger: parseOptionalNonNegativeInteger,
            collectWbsHolidayDates: mikuprojectWbsXlsx.collectWbsHolidayDates
        });
    }
    function downloadBlob(blob, filename) {
        mikuprojectMainSupport.downloadBlob(document, blob, filename);
    }
    function formatTimestampCompact(date) {
        return mikuprojectMainUtil.formatTimestampCompact(date);
    }
    async function renderSvgPreview() {
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
    function setSvgPreviewMode(mode) {
        currentSvgPreviewState.state = mikuprojectMainPreview.setMode(currentSvgPreviewState.state, mode);
        updateSvgPreviewModeButtons();
        renderCurrentSvgPreviewMarkup();
    }
    function buildCurrentOutputArchiveEntries() {
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
    function buildCurrentOutputArchive() {
        const entries = buildCurrentOutputArchiveEntries();
        const stamp = formatTimestampCompact(new Date());
        return {
            fileName: `mikuproject-all-${stamp}.zip`,
            zipBytes: mikuprojectMainUtil.packZipEntries(entries),
            entryCount: entries.length
        };
    }
    function downloadAllOutputs() {
        const archive = buildCurrentOutputArchive();
        downloadBlob(new Blob([archive.zipBytes], { type: "application/zip" }), archive.fileName);
        setStatus(`All 出力を保存しました (${archive.entryCount} 件, ZIP)`);
        showToast("All を保存しました");
        setActiveTab("output");
    }
    function setStatus(message) {
        mikuprojectMainUi.setStatus(document, message);
    }
    function formatSaveStamp(date) {
        return mikuprojectMainUtil.formatSaveStamp(date);
    }
    function updateXmlSaveState(isDirty) {
        mikuprojectMainUi.updateXmlSaveState(document, {
            isDirty,
            lastSavedXmlStamp
        });
    }
    function markXmlDirty() {
        updateXmlSaveState(true);
    }
    function markXmlSavedCurrent() {
        lastSavedXmlText = getTextArea("xmlInput").value;
        lastSavedXmlStamp = formatSaveStamp(new Date());
        updateXmlSaveState(false);
    }
    function refreshXmlSaveState() {
        updateXmlSaveState(getTextArea("xmlInput").value !== lastSavedXmlText);
    }
    function syncXmlTextFromModel(model) {
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
    function renderValidationIssues(issues) {
        mikuprojectMainRender.renderValidationIssues(document, issues);
    }
    function renderImportWarnings(warnings, options = {}) {
        mikuprojectMainRender.renderImportWarnings(document, warnings, options);
    }
    function renderXlsxImportSummary(changes, options = {}) {
        mikuprojectMainRender.renderXlsxImportSummary(document, changes, options);
    }
    function updateSummary(model) {
        mikuprojectMainRender.updateSummary(document, model, updateSvgButton);
    }
    function loadSample() {
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
    async function importXmlFromFile(file) {
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
    function ensureCurrentModel() {
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
    function parseCurrentXml(options = {}) {
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
    async function exportCurrentMermaid(options = {}) {
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
    function exportCurrentCsv() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const exported = mikuprojectMainExport.buildCsvExport({
            model,
            exportCsvParentId: mikuprojectXml.exportCsvParentId
        });
        downloadBlob(new Blob([exported.text], { type: "text/csv;charset=utf-8" }), exported.fileName);
        mikuprojectMainFlow.completeOutput({
            setStatus,
            showToast,
            setActiveTab,
            statusMessage: "内部モデルから CSV + ParentID を生成して保存しました",
            toastMessage: "CSV を保存しました"
        });
    }
    function exportCurrentProjectOverviewView() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const exported = mikuprojectMainExport.buildProjectOverviewExport({
            model,
            exportProjectOverviewView: mikuprojectXml.exportProjectOverviewView
        });
        getTextArea("projectOverviewOutput").value = exported.text.trimEnd();
        downloadBlob(new Blob([exported.text], { type: "application/json;charset=utf-8" }), exported.fileName);
        mikuprojectMainFlow.completeOutput({
            setStatus,
            showToast,
            setActiveTab,
            statusMessage: "project_overview_view を生成して保存しました",
            toastMessage: "project_overview_view を保存しました"
        });
    }
    function exportCurrentTaskEditView() {
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
        downloadBlob(new Blob([exported.text], { type: "application/json;charset=utf-8" }), exported.fileName);
        mikuprojectMainFlow.completeOutput({
            setStatus,
            showToast,
            setActiveTab,
            statusMessage: "task_edit_view を生成して保存しました",
            toastMessage: "task_edit_view を保存しました"
        });
    }
    function exportCurrentAiProjectionBundle() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const exported = mikuprojectMainExport.buildAiProjectionBundleExport({
            model,
            exportProjectOverviewView: mikuprojectXml.exportProjectOverviewView,
            exportPhaseDetailView: mikuprojectXml.exportPhaseDetailView,
            exportTaskEditView: mikuprojectXml.exportTaskEditView
        });
        getTextArea("aiBundleOutput").value = exported.text.trimEnd();
        downloadBlob(new Blob([exported.text], { type: "application/json;charset=utf-8" }), exported.fileName);
        mikuprojectMainFlow.completeOutput({
            setStatus,
            showToast,
            setActiveTab,
            statusMessage: `AI 連携用まとめ JSON を生成して保存しました (phase_detail_view full ${exported.phaseCount} 件 / task_edit_view ${exported.taskCount} 件)`,
            toastMessage: "AI 連携用まとめ JSON を保存しました"
        });
    }
    async function importProjectDraftFromText() {
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
    async function importPatchJsonFromSourceText(sourceText) {
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
    async function importAiEditJsonFromText() {
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
    function loadProjectDraftSample() {
        const sampleDraftText = JSON.stringify(mikuprojectXml.SAMPLE_PROJECT_DRAFT_VIEW, null, 2);
        getTextArea("projectDraftImportInput").value = sampleDraftText;
        setStatus("サンプル project_draft_view を読み込みました");
        setActiveTab("input");
    }
    async function importProjectDraftFromFile(file) {
        if (!file) {
            throw new Error("project_draft_view JSON ファイルを選択してください");
        }
        const sourceText = await file.text();
        getTextArea("projectDraftImportInput").value = sourceText;
        await importProjectDraftFromText();
    }
    async function importWorkbookJsonFromSourceText(sourceText) {
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
    async function importWorkbookJsonFromFile(file) {
        if (!file) {
            throw new Error("workbook JSON ファイルを選択してください");
        }
        const sourceText = await file.text();
        await importWorkbookJsonFromSourceText(sourceText);
    }
    async function importFromFile(file) {
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
    function exportCurrentPhaseDetailView(mode = "scoped") {
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
        downloadBlob(new Blob([exported.text], { type: "application/json;charset=utf-8" }), exported.fileName);
        setStatus(`phase_detail_view (${exported.resolvedMode}) を生成して保存しました`);
        showToast(`phase_detail_view (${exported.resolvedMode}) を保存しました`);
        setActiveTab("output");
    }
    function exportCurrentXlsx() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const exported = mikuprojectMainExport.buildXlsxExport({
            model,
            createWorkbookCodec: () => new mikuprojectExcelIo.XlsxWorkbookCodec(),
            exportProjectWorkbook: mikuprojectProjectXlsx.exportProjectWorkbook
        });
        downloadBlob(new Blob([exported.bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), exported.fileName);
        setStatus("XLSX ファイルをエクスポートしました");
        showToast("XLSX を保存しました");
        setActiveTab("output");
    }
    function exportCurrentWorkbookJson() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const exported = mikuprojectMainExport.buildWorkbookJsonExport({
            model,
            exportProjectWorkbookJson: mikuprojectProjectWorkbookJson.exportProjectWorkbookJson
        });
        getTextArea("workbookJsonOutput").value = exported.text;
        downloadBlob(new Blob([`${exported.text}\n`], { type: "application/json;charset=utf-8" }), exported.fileName);
        setStatus("XLSX 相当の workbook JSON を生成して保存しました");
        showToast("JSON を保存しました");
        setActiveTab("output");
    }
    function exportCurrentWbsXlsx() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const options = buildCurrentWbsOptions(model);
        const exported = mikuprojectMainExport.buildWbsXlsxExport({
            model,
            options,
            createWorkbookCodec: () => new mikuprojectExcelIo.XlsxWorkbookCodec(),
            exportWbsWorkbook: mikuprojectWbsXlsx.exportWbsWorkbook
        });
        downloadBlob(new Blob([exported.bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), exported.fileName);
        const displayRangeText = options.displayDaysBeforeBaseDate !== undefined || options.displayDaysAfterBaseDate !== undefined
            ? ` / 表示期間 営業日 基準日前 ${options.displayDaysBeforeBaseDate || 0} 日, 基準日後 ${options.displayDaysAfterBaseDate || 0} 日`
            : "";
        const progressBandText = " / 進捗帯 営業日";
        setStatus(`WBS XLSX ファイルをエクスポートしました${options.holidayDates.length > 0 ? ` (祝日 ${options.holidayDates.length} 件)` : ""}${displayRangeText}${progressBandText}`);
        showToast("WBS XLSX を保存しました");
        setActiveTab("output");
    }
    async function importXlsxFromFile(file) {
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
    async function importCsvFromFile(file) {
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
    function downloadCurrentXml() {
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
    async function downloadCurrentSvg() {
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
        downloadBlob(new Blob([exported.text], { type: "image/svg+xml;charset=utf-8" }), exported.fileName);
        setStatus("Daily SVG を保存しました");
        showToast("Daily SVG を保存しました");
        setActiveTab("output");
    }
    function downloadCurrentWeeklySvg() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const weeklySvg = mikuprojectNativeSvg.exportWeeklyNativeSvg(model, buildCurrentWbsOptions(model));
        if (!weeklySvg) {
            setStatus("出力する Weekly SVG がありません");
            return;
        }
        const exported = mikuprojectMainExport.buildWeeklySvgExport({ svg: weeklySvg });
        downloadBlob(new Blob([exported.text], { type: "image/svg+xml;charset=utf-8" }), exported.fileName);
        setStatus("Weekly SVG を保存しました");
        showToast("Weekly SVG を保存しました");
        setActiveTab("output");
    }
    function downloadCurrentMonthlyWbsSvgZip() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const archive = mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive(model);
        if (!archive.entries.length || archive.zipBytes.byteLength === 0) {
            throw new Error("出力する月別 WBS カレンダー SVG がありません");
        }
        const exported = mikuprojectMainExport.buildMonthlySvgZipExport({ zipBytes: archive.zipBytes });
        downloadBlob(new Blob([exported.bytes], { type: "application/zip" }), exported.fileName);
        setStatus(`Monthly Calendar SVG を保存しました (${archive.entries.length} か月分, ZIP)`);
        showToast("Monthly Calendar SVG を保存しました");
        setActiveTab("output");
    }
    function downloadCurrentMermaidMmd() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const mermaidText = mikuprojectXml.exportMermaidGantt(model);
        getTextArea("mermaidOutput").value = mermaidText;
        const exported = mikuprojectMainExport.buildMermaidExport({ mermaidText });
        downloadBlob(new Blob([exported.text], { type: "text/plain;charset=utf-8" }), exported.fileName);
        setStatus("Mermaid を保存しました");
        showToast("Mermaid を保存しました");
        setActiveTab("output");
    }
    function downloadCurrentWbsMarkdown() {
        const model = ensureCurrentModel();
        syncXmlTextFromModel(model);
        const options = buildCurrentWbsOptions(model);
        const markdownText = mikuprojectWbsMarkdown.exportWbsMarkdown(model, options);
        const exported = mikuprojectMainExport.buildWbsMarkdownExport({ markdownText });
        downloadBlob(new Blob([exported.text], { type: "text/markdown;charset=utf-8" }), exported.fileName);
        setStatus("WBS Markdown を保存しました");
        showToast("WBS Markdown を保存しました");
        setActiveTab("output");
    }
    function runRoundTripCheck() {
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
    function bindEvents() {
        mikuprojectMainEvents.bind({
            document,
            setStatus,
            refreshXmlSaveState,
            markXmlSourceDirty: () => {
                isXmlSourceDirty = true;
            },
            getImportFileInput: () => getElement("importFileInput"),
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
    function initialize() {
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
    globalThis.__mikuprojectMainTestHooks = {
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
