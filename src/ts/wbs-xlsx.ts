/*
 * Copyright 2026 Toshiki Iga
 * SPDX-License-Identifier: Apache-2.0
 */
(() => {
  type WbsXlsxCellLike = {
    value?: string | number | boolean;
    numberFormat?: "general" | "integer" | "decimal" | "date" | "datetime" | "percent";
    horizontalAlign?: "left" | "center" | "right";
    verticalAlign?: "top" | "center" | "bottom";
    wrapText?: boolean;
    bold?: boolean;
    fontSize?: number;
    fillColor?: string;
    border?: "thin";
  };

  type WbsXlsxWorkbookLike = {
    sheets: Array<{
      name: string;
      columns?: Array<{ width?: number; hidden?: boolean }>;
      mergedRanges?: string[];
      rows: Array<{
        height?: number;
        cells: WbsXlsxCellLike[];
      }>;
    }>;
  };

  type WbsExportOptions = {
    holidayDates?: string[];
    displayDaysBeforeBaseDate?: number;
    displayDaysAfterBaseDate?: number;
    useBusinessDaysForDisplayRange?: boolean;
    useBusinessDaysForProgressBand?: boolean;
  };

  type WbsSheetLayoutHelper = {
    columnName(columnIndex: number): string;
    columnIndex(columnReference: string): number;
    reference(rowNumber: number, columnIndex: number): string;
    parseCellReference(reference: string): {
      reference: string;
      rowNumber: number;
      rowIndex: number;
      columnName: string;
      columnIndex: number;
    };
    range(startReference: string, endReference: string): string;
    describeCell(reference: string): string;
    logCell(reference: string, label?: string, logger?: (...args: unknown[]) => void): string;
  };

  type WbsDatebandHelper = {
    parseDateOnly(value: string | undefined): Date | null;
    formatDateOnly(value: Date | null): string;
    buildDateBand(startDate: string | undefined, finishDate: string | undefined): string[];
    collectWbsHolidayDates(model: ProjectModel): string[];
    collectProjectNonWorkingDayTypes(model: ProjectModel): Set<number>;
    buildDisplayDateBand(
      startDate: string | undefined,
      finishDate: string | undefined,
      baseDate: string | undefined,
      displayDaysBeforeBaseDate: number | undefined,
      displayDaysAfterBaseDate: number | undefined,
      holidaySet: Set<string>,
      nonWorkingDayTypes: Set<number>,
      useBusinessDaysForDisplayRange: boolean | undefined
    ): string[];
    isWeeklyNonWorkingDay(day: string, nonWorkingDayTypes: Set<number>): boolean;
  };

  type WbsXlsxSectionsHelper = {
    firstResourceName(resourceNames: string[] | undefined): string;
    formatCalendarLabel(calendarUID: string | undefined, calendarNameByUid: Map<string, string>): string;
    truncateWbsReference(value: string | undefined, maxLength: number): string;
    referenceCell(
      task: TaskModel,
      value: string | undefined,
      horizontalAlign?: "left" | "center" | "right"
    ): WbsXlsxCellLike;
    projectInfoRows(
      project: ProjectModel["project"],
      calendarNameByUid: Map<string, string>,
      holidayCount: number,
      columnCount: number,
      startColumnIndex: number,
      startRowNumber: number
    ): {
      mergedRanges: string[];
      rows: Array<{ height?: number; cells: WbsXlsxCellLike[] }>;
    };
    legendRows(
      columnCount: number,
      startRowNumber: number
    ): {
      mergedRanges: string[];
      rows: Array<{ height?: number; cells: WbsXlsxCellLike[] }>;
    };
    displaySummaryRows(
      displayDays: number,
      businessDays: number,
      baseDate: string | undefined,
      taskCount: number,
      resourceCount: number,
      assignmentCount: number,
      calendarCount: number,
      columnCount: number,
      startColumnIndex?: number,
      startRowNumber?: number,
      displayDaysBeforeBaseDate?: number,
      displayDaysAfterBaseDate?: number,
      useBusinessDaysForDisplayRange?: boolean,
      useBusinessDaysForProgressBand?: boolean
    ): {
      mergedRanges: string[];
      rows: Array<{ height?: number; cells: WbsXlsxCellLike[] }>;
    };
    formatWbsDate(value: string | undefined): string;
  };

  const HEADER_FILL = "#D9EAF7";
  const HEADER_ID_FILL = "#E1EDF8";
  const HEADER_STRUCTURE_FILL = "#E6F0DF";
  const HEADER_SCHEDULE_FILL = "#FDE7D3";
  const HEADER_STATUS_FILL = "#FBE4EC";
  const HEADER_ASSIGNMENT_FILL = "#E2F1EF";
  const SUMMARY_SCHEDULE_FILL = "#FDF1E4";
  const SUMMARY_ASSIGNMENT_FILL = "#E8F4F1";
  const PHASE_FILL = "#EEF7E8";
  const TASK_KIND_FILL = "#EEF2F6";
  const MILESTONE_FILL = "#FFF4E0";
  const IDENTIFIER_FILL = "#F7F9FC";
  const PLACEHOLDER_FILL = "#F5F7FA";
  const BAND_FILL = "#F4F7FB";
  const ACTIVE_BAND_FILL = "#D9EFFF";
  const PROGRESS_BAND_FILL = "#8EB9EA";
  const WEEKEND_BAND_FILL = "#EEF3F8";
  const WEEK_START_BAND_FILL = "#E3EEF9";
  const MONTH_BOUNDARY_WEEK_FILL = "#D6E7F8";
  const MONTH_START_HEADER_FILL = "#DCEAF7";
  const SATURDAY_HEADER_FILL = "#EEF3F8";
  const SUNDAY_HEADER_FILL = "#EEF3F8";
  const TODAY_BAND_FILL = "#FFE6A7";
  const TODAY_ACTIVE_BAND_FILL = "#C9DFF8";
  const TODAY_PROGRESS_BAND_FILL = "#6F9FD8";
  const HOLIDAY_BAND_FILL = "#FCE4EC";
  const DIVIDER_FILL = "#D9E2EA";
  const BASEDATE_GUIDE_TAIL_FILL = "#FFF8E1";
  const NAME_COLUMN_FILL = "#FBFCFE";
  const SCHEDULE_COLUMN_FILL = "#FCFAF7";
  const PROGRESS_COLUMN_FILL = "#FCF8FB";
  const REFERENCE_COLUMN_FILL = "#F8FBFB";
  const wbsXlsxLayout = (globalThis as typeof globalThis & {
    __mikuprojectWbsXlsxLayout?: {
      createWbsSheetLayoutHelper: () => WbsSheetLayoutHelper;
    };
  }).__mikuprojectWbsXlsxLayout;
  const wbsDateband = (globalThis as typeof globalThis & {
    __mikuprojectWbsDateband?: {
      createWbsDatebandHelper: () => WbsDatebandHelper;
    };
  }).__mikuprojectWbsDateband;
  const wbsXlsxSections = (globalThis as typeof globalThis & {
    __mikuprojectWbsXlsxSections?: {
      createWbsXlsxSectionsHelper: (config: {
        layout: WbsSheetLayoutHelper;
        fills: Record<string, string>;
      }) => WbsXlsxSectionsHelper;
    };
  }).__mikuprojectWbsXlsxSections;

  if (!wbsXlsxLayout) {
    throw new Error("mikuproject WBS xlsx layout module is not loaded");
  }
  if (!wbsDateband) {
    throw new Error("mikuproject WBS dateband module is not loaded");
  }
  if (!wbsXlsxSections) {
    throw new Error("mikuproject WBS xlsx sections module is not loaded");
  }

  const WBS_LAYOUT = wbsXlsxLayout.createWbsSheetLayoutHelper();
  const WBS_DATEBAND = wbsDateband.createWbsDatebandHelper();
  const WBS_SECTIONS = wbsXlsxSections.createWbsXlsxSectionsHelper({
    layout: WBS_LAYOUT,
    fills: {
      headerId: HEADER_ID_FILL,
      headerFill: HEADER_FILL,
      headerStructure: HEADER_STRUCTURE_FILL,
      headerSchedule: HEADER_SCHEDULE_FILL,
      headerStatus: HEADER_STATUS_FILL,
      headerAssignment: HEADER_ASSIGNMENT_FILL,
      summarySchedule: SUMMARY_SCHEDULE_FILL,
      summaryAssignment: SUMMARY_ASSIGNMENT_FILL,
      phase: PHASE_FILL,
      milestone: MILESTONE_FILL,
      placeholder: PLACEHOLDER_FILL,
      divider: DIVIDER_FILL,
      referenceColumn: REFERENCE_COLUMN_FILL
    }
  });
  const pxWidth = (pixels: number) => Math.round((pixels / 7) * 100) / 100;
  const collectWbsHolidayDates = (model: ProjectModel): string[] => WBS_DATEBAND.collectWbsHolidayDates(model);
  const collectProjectNonWorkingDayTypes = (model: ProjectModel): Set<number> => WBS_DATEBAND.collectProjectNonWorkingDayTypes(model);
  const buildDateBand = (startDate: string | undefined, finishDate: string | undefined): string[] =>
    WBS_DATEBAND.buildDateBand(startDate, finishDate);
  const buildDisplayDateBand = (
    startDate: string | undefined,
    finishDate: string | undefined,
    baseDate: string | undefined,
    displayDaysBeforeBaseDate: number | undefined,
    displayDaysAfterBaseDate: number | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>,
    useBusinessDaysForDisplayRange: boolean | undefined
  ): string[] => WBS_DATEBAND.buildDisplayDateBand(
    startDate,
    finishDate,
    baseDate,
    displayDaysBeforeBaseDate,
    displayDaysAfterBaseDate,
    holidaySet,
    nonWorkingDayTypes,
    useBusinessDaysForDisplayRange
  );
  const isWeeklyNonWorkingDay = (day: string, nonWorkingDayTypes: Set<number>): boolean =>
    WBS_DATEBAND.isWeeklyNonWorkingDay(day, nonWorkingDayTypes);
  const parseDateOnly = (value: string | undefined): Date | null => WBS_DATEBAND.parseDateOnly(value);
  const formatDateOnly = (value: Date | null): string => WBS_DATEBAND.formatDateOnly(value);
  const firstResourceName = (resourceNames: string[] | undefined): string => WBS_SECTIONS.firstResourceName(resourceNames);
  const formatCalendarLabel = (calendarUID: string | undefined, calendarNameByUid: Map<string, string>): string =>
    WBS_SECTIONS.formatCalendarLabel(calendarUID, calendarNameByUid);
  const truncateWbsReference = (value: string | undefined, maxLength: number): string =>
    WBS_SECTIONS.truncateWbsReference(value, maxLength);
  const referenceCell = (
    task: TaskModel,
    value: string | undefined,
    horizontalAlign: "left" | "center" | "right" = "center"
  ): WbsXlsxCellLike => WBS_SECTIONS.referenceCell(task, value, horizontalAlign);
  const projectInfoRows = (
    project: ProjectModel["project"],
    calendarNameByUid: Map<string, string>,
    holidayCount: number,
    columnCount: number,
    startColumnIndex: number,
    startRowNumber: number
  ) => WBS_SECTIONS.projectInfoRows(project, calendarNameByUid, holidayCount, columnCount, startColumnIndex, startRowNumber);
  const legendRows = (columnCount: number, startRowNumber: number) => WBS_SECTIONS.legendRows(columnCount, startRowNumber);
  const displaySummaryRows = (
    displayDays: number,
    businessDays: number,
    baseDate: string | undefined,
    taskCount: number,
    resourceCount: number,
    assignmentCount: number,
    calendarCount: number,
    columnCount: number,
    startColumnIndex = 5,
    startRowNumber = 5,
    displayDaysBeforeBaseDate?: number,
    displayDaysAfterBaseDate?: number,
    useBusinessDaysForDisplayRange?: boolean,
    useBusinessDaysForProgressBand?: boolean
  ) => WBS_SECTIONS.displaySummaryRows(
    displayDays,
    businessDays,
    baseDate,
    taskCount,
    resourceCount,
    assignmentCount,
    calendarCount,
    columnCount,
    startColumnIndex,
    startRowNumber,
    displayDaysBeforeBaseDate,
    displayDaysAfterBaseDate,
    useBusinessDaysForDisplayRange,
    useBusinessDaysForProgressBand
  );
  const formatWbsDate = (value: string | undefined): string => WBS_SECTIONS.formatWbsDate(value);

  function exportWbsWorkbook(model: ProjectModel, options: WbsExportOptions = {}): WbsXlsxWorkbookLike {
    const nonWorkingDayTypes = collectProjectNonWorkingDayTypes(model);
    const resourceNameByUid = new Map(model.resources.map((resource) => [resource.uid, resource.name]));
    const predecessorNameByUid = new Map(model.tasks.map((task) => [task.uid, task.name]));
    const calendarNameByUid = new Map(model.calendars.map((calendar) => [calendar.uid, calendar.name]));
    const resourceNamesByTaskUid = new Map<string, string[]>();
    const holidaySet = new Set([
      ...collectWbsHolidayDates(model),
      ...(options.holidayDates || []).map((day) => day.slice(0, 10))
    ]);

    for (const assignment of model.assignments) {
      const resourceName = resourceNameByUid.get(assignment.resourceUid);
      if (!resourceName) {
        continue;
      }
      const resourceNames = resourceNamesByTaskUid.get(assignment.taskUid) || [];
      if (!resourceNames.includes(resourceName)) {
        resourceNames.push(resourceName);
      }
      resourceNamesByTaskUid.set(assignment.taskUid, resourceNames);
    }

    const dateBand = buildDisplayDateBand(
      model.project.startDate,
      model.project.finishDate,
      model.project.currentDate,
      options.displayDaysBeforeBaseDate,
      options.displayDaysAfterBaseDate,
      holidaySet,
      nonWorkingDayTypes,
      options.useBusinessDaysForDisplayRange
    );
    const fixedHeaders = [
      "UID",
      "ID",
      "WBS",
      "種別",
      "階層",
      "名称",
      "開始",
      "終了",
      "期間",
      "タスク詳細",
      "進捗",
      "作業進捗",
      "マイル",
      "サマリ",
      "クリティカル",
      "担当",
      "カレンダ",
      "リソース",
      "先行"
    ];
    const dividerColumnIndex = fixedHeaders.length + 1;
    const dateBandStartColumnIndex = dividerColumnIndex;
    const totalColumns = fixedHeaders.length + 1 + dateBand.length;
    const rows: WbsXlsxWorkbookLike["sheets"][number]["rows"] = [];
    const mergedRanges = [];
    const projectInfoBlock = projectInfoRows(
      model.project,
      calendarNameByUid,
      holidaySet.size,
      totalColumns,
      0,
      rows.length + 1
    );
    overlayRows(rows, 0, projectInfoBlock.rows, totalColumns);
    const exportTimestampRow = rows[1] || (rows[1] = emptyRow(totalColumns));
    exportTimestampRow.cells[9] = {
      value: formatWbsExportTimestamp(new Date()),
      horizontalAlign: "left",
      verticalAlign: "center"
    };
    mergedRanges.push(...projectInfoBlock.mergedRanges);
    rows.push(dateBandHeaderRow(fixedHeaders.length + 1, dateBand, model.project.currentDate, holidaySet, nonWorkingDayTypes));
    rows.push(weekdayHeaderRow(fixedHeaders, dateBand, model.project.currentDate, holidaySet, nonWorkingDayTypes));
    rows.push(...model.tasks.map((task) => ({
      height: taskRowHeight(task),
      cells: [
        identifierCell(task, task.uid),
        identifierCell(task, task.id),
        identifierCell(task, task.wbs || task.outlineNumber),
        kindCell(task),
        identifierCell(task, task.outlineLevel),
        taskCell(task, formatTaskLabel(task), "left"),
        taskCell(task, formatWbsDate(task.start), "center"),
        taskCell(task, formatWbsDate(task.finish), "center"),
        taskCell(task, formatDurationLabel(task, holidaySet, nonWorkingDayTypes, options.useBusinessDaysForProgressBand), "center"),
        detailCell(task, task.notes),
        progressCell(task, task.percentComplete),
        progressCell(task, task.percentWorkComplete),
        flagCell(task, task.milestone, "Mil"),
        flagCell(task, task.summary, "Sum"),
        flagCell(task, task.critical, "Crit"),
        referenceCell(task, truncateWbsReference(firstResourceName(resourceNamesByTaskUid.get(task.uid)), 14), "center"),
        referenceCell(task, formatCalendarLabel(task.calendarUID || model.project.calendarUID, calendarNameByUid), "center"),
        referenceCell(task, truncateWbsReference((resourceNamesByTaskUid.get(task.uid) || []).join(", "), 18)),
        referenceCell(task, truncateWbsReference(task.predecessors.map((item) => predecessorNameByUid.get(item.predecessorUid) || item.predecessorUid).join(", "), 18)),
        dividerCell(),
        ...dateBand.map((day) => dateBandCell(task, day, model.project.currentDate, holidaySet, nonWorkingDayTypes, options.useBusinessDaysForProgressBand))
      ]
    })));
    rows.push(emptyRow(totalColumns, 28));
    const legendBlock = legendRows(totalColumns, rows.length + 1);
    rows.push(...legendBlock.rows);
    mergedRanges.push(...legendBlock.mergedRanges);
    rows.push(emptyRow(totalColumns, 28));
    const summaryBlock = displaySummaryRows(
      dateBand.length,
      countBusinessDays(dateBand, holidaySet, nonWorkingDayTypes),
      model.project.currentDate,
      model.tasks.length,
      model.resources.length,
      model.assignments.length,
      model.calendars.length,
      totalColumns,
      0,
      rows.length + 1,
      options.displayDaysBeforeBaseDate,
      options.displayDaysAfterBaseDate,
      options.useBusinessDaysForDisplayRange,
      options.useBusinessDaysForProgressBand
    );
    rows.push(...summaryBlock.rows);
    mergedRanges.push(...summaryBlock.mergedRanges);

    return {
      sheets: [
        {
          name: "WBS",
          columns: [
            { width: pxWidth(45) }, { width: pxWidth(45) }, { width: pxWidth(65) }, { width: pxWidth(60) }, { width: pxWidth(45) }, { width: 42 },
            { width: pxWidth(85) }, { width: pxWidth(85) }, { width: pxWidth(65) }, { width: 28 }, { width: 14 },
            { width: 18, hidden: true }, { width: 12, hidden: true }, { width: 12, hidden: true }, { width: 12, hidden: true },
            { width: pxWidth(85) }, { width: 12, hidden: true }, { width: 20, hidden: true }, { width: 18, hidden: true }, { width: 3 },
            ...dateBand.map(() => ({ width: 6 }))
          ],
          mergedRanges,
          rows
        }
      ]
    };
  }

  function emptyRow(columnCount: number, height = 22) {
    return {
      height,
      cells: Array.from({ length: columnCount }, () => ({}))
    };
  }

  function overlayRows(
    rows: Array<{ height?: number; cells: WbsXlsxCellLike[] }>,
    startIndex: number,
    blockRows: Array<{ height?: number; cells: WbsXlsxCellLike[] }>,
    columnCount: number
  ) {
    blockRows.forEach((blockRow, offset) => {
      const rowIndex = startIndex + offset;
      if (!rows[rowIndex]) {
        rows[rowIndex] = emptyRow(columnCount);
      }
      const targetRow = rows[rowIndex];
      if ((blockRow.height || 0) > (targetRow.height || 0)) {
        targetRow.height = blockRow.height;
      }
      blockRow.cells.forEach((cell, cellIndex) => {
        if (hasCellContent(cell)) {
          targetRow.cells[cellIndex] = cell;
        }
      });
    });
  }

  function hasCellContent(cell: WbsXlsxCellLike | undefined): boolean {
    return !!cell && Object.keys(cell).length > 0;
  }

  function formatTaskLabel(task: TaskModel): string {
    const prefix = task.summary ? "> " : (task.milestone ? "* " : "- ");
    return `${"  ".repeat(Math.max(0, task.outlineLevel - 1))}${prefix}${task.name}`;
  }

  function classifyTaskKind(task: TaskModel): string {
    if (task.summary) {
      return "フェーズ";
    }
    if (task.milestone) {
      return "マイル";
    }
    return "タスク";
  }

  function sheetTitleRow(title: string, columnCount: number) {
    return {
      height: 24,
      cells: [
        {
          value: title,
          bold: true,
          fontSize: 16,
          horizontalAlign: "left"
        },
        ...Array.from({ length: Math.max(0, columnCount - 1) }, () => ({
          fillColor: "#EEF4FA"
        }))
      ]
    };
  }

  function infoRow(text: string, columnCount: number) {
    return {
      height: 24,
      cells: [
        {
          value: text,
          border: "thin",
          horizontalAlign: "left"
        },
        ...Array.from({ length: Math.max(0, columnCount - 1) }, () => ({}))
      ]
    };
  }

  function weekBandRow(
    fixedColumnCount: number,
    weekBandRanges: Array<{ startIndex: number; label: string; hasMonthBoundary: boolean }>,
    dateBandLength: number
  ) {
    const weekLabelColumnIndex = WBS_LAYOUT.columnIndex("S");
    const dividerColumnIndex = WBS_LAYOUT.columnIndex("T");
    const bandCells = Array.from({ length: dateBandLength }, () => ({} as WbsXlsxCellLike));
    weekBandRanges.forEach((item, index) => {
      bandCells[item.startIndex] = {
        value: item.label,
        bold: true,
        fontSize: 14,
        border: "thin" as const,
        horizontalAlign: "center" as const,
        fillColor: item.hasMonthBoundary ? MONTH_BOUNDARY_WEEK_FILL : (index % 2 === 0 ? "#EDF4FB" : "#EAF1F9")
      };
    });
    return {
      height: 24,
      cells: [
        ...Array.from({ length: fixedColumnCount }, (_, index) => {
          if (index === weekLabelColumnIndex) {
            return {
              value: "週",
              bold: true,
              fontSize: 14,
              border: "thin" as const,
              horizontalAlign: "center" as const,
              fillColor: "#E3EEF9"
            };
          }
          if (index === dividerColumnIndex) {
            return dividerCell();
          }
          if (index < weekLabelColumnIndex) {
            return {};
          }
          return {};
        }),
        ...bandCells
      ]
    };
  }

  function headerRow(labels: Array<string | WbsXlsxCellLike>) {
    return {
      height: 24,
      cells: labels.map((label) => {
        if (typeof label === "string") {
          return {
            value: label,
            bold: true,
            fillColor: headerFillForLabel(label),
            border: "thin" as const,
            horizontalAlign: "center" as const,
            verticalAlign: "center" as const
          };
        }
        return {
          border: "thin" as const,
          horizontalAlign: "center" as const,
          verticalAlign: "center" as const,
          ...label
        };
      })
    };
  }

  function weekdayRow(
    fixedColumnCount: number,
    dateBand: string[],
    currentDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>
  ) {
    return {
      height: 24,
      cells: [
        ...Array.from({ length: fixedColumnCount }, () => ({} as WbsXlsxCellLike)),
        ...dateBand.map((day) => weekdayCell(day, currentDate, holidaySet, nonWorkingDayTypes))
      ]
    };
  }

  function dateBandHeaderRow(
    fixedColumnCount: number,
    dateBand: string[],
    currentDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>
  ) {
    return {
      height: 24,
      cells: [
        ...Array.from({ length: fixedColumnCount }, () => ({} as WbsXlsxCellLike)),
        ...dateBand.map((day) => dateNumberCell(day, currentDate, holidaySet, nonWorkingDayTypes))
      ]
    };
  }

  function weekdayHeaderRow(
    fixedHeaders: string[],
    dateBand: string[],
    currentDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>
  ) {
    return headerRow([
      ...fixedHeaders,
      dividerCell(),
      ...dateBand.map((day) => weekdayCell(day, currentDate, holidaySet, nonWorkingDayTypes))
    ]);
  }

  function dividerCell(): WbsXlsxCellLike {
    return {
      value: "",
      fillColor: DIVIDER_FILL,
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center"
    };
  }

  function headerFillForLabel(label: string): string {
    if (label === "UID" || label === "ID") {
      return HEADER_ID_FILL;
    }
    if (label === "WBS" || label === "種別" || label === "階層" || label === "名称") {
      return HEADER_STRUCTURE_FILL;
    }
    if (label === "開始" || label === "終了" || label === "期間") {
      return HEADER_SCHEDULE_FILL;
    }
    if (label === "タスク詳細") {
      return HEADER_FILL;
    }
    if (label === "進捗" || label === "作業進捗" || label === "マイル" || label === "サマリ" || label === "クリティカル") {
      return HEADER_STATUS_FILL;
    }
    if (label === "担当" || label === "カレンダ" || label === "リソース" || label === "先行") {
      return HEADER_ASSIGNMENT_FILL;
    }
    return HEADER_FILL;
  }

  function stringifyCellValue(value: string | number | boolean): string {
    return typeof value === "string" ? value : String(value);
  }

  function taskCell(
    task: TaskModel,
    value: string | number | boolean | undefined,
    horizontalAlign: "left" | "center" | "right" = "left"
  ): WbsXlsxCellLike {
    if (value === undefined || value === "") {
      return {};
    }
    return {
      value: stringifyCellValue(value),
      border: "thin",
      horizontalAlign,
      verticalAlign: "center",
      wrapText: typeof value === "string" ? true : undefined,
      bold: task.summary || task.milestone || false,
      fillColor: task.summary
        ? PHASE_FILL
        : (task.milestone
          ? MILESTONE_FILL
          : (horizontalAlign === "left"
            ? NAME_COLUMN_FILL
            : (horizontalAlign === "center" ? SCHEDULE_COLUMN_FILL : undefined)))
    };
  }

  function detailCell(task: TaskModel, value: string | undefined): WbsXlsxCellLike {
    const normalized = value?.trim() || "";
    const placeholder = !normalized;
    return {
      value: placeholder ? "-" : normalized,
      border: "thin",
      horizontalAlign: "left",
      verticalAlign: "center",
      wrapText: placeholder ? undefined : true,
      bold: task.summary || task.milestone || false,
      fillColor: placeholder
        ? PLACEHOLDER_FILL
        : (task.summary
          ? PHASE_FILL
          : (task.milestone ? MILESTONE_FILL : NAME_COLUMN_FILL))
    };
  }

  function taskRowHeight(task: TaskModel): number | undefined {
    const labelLineCount = estimateWrappedLineCount(formatTaskLabel(task), 22);
    const notesLineCount = estimateWrappedLineCount((task.notes || "").trim(), 18);
    const maxLineCount = Math.max(labelLineCount, notesLineCount, 1);
    if (maxLineCount >= 5) {
      return 82;
    }
    if (maxLineCount === 4) {
      return 70;
    }
    if (maxLineCount === 3) {
      return 58;
    }
    if (maxLineCount === 2) {
      return 46;
    }
    return 34;
  }

  function estimateWrappedLineCount(value: string, charactersPerLine: number): number {
    const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    if (!normalized) {
      return 1;
    }
    return normalized
      .split("\n")
      .reduce((count, line) => count + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0);
  }

  function kindCell(task: TaskModel): WbsXlsxCellLike {
    return {
      value: classifyTaskKind(task),
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      bold: true,
      fillColor: task.summary ? PHASE_FILL : (task.milestone ? MILESTONE_FILL : TASK_KIND_FILL)
    };
  }

  function identifierCell(task: TaskModel, value: string | number | boolean | undefined): WbsXlsxCellLike {
    if (value === undefined || value === "") {
      return {};
    }
    return {
      value: stringifyCellValue(value),
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      bold: task.summary || task.milestone || false,
      fillColor: task.summary ? PHASE_FILL : (task.milestone ? MILESTONE_FILL : IDENTIFIER_FILL)
    };
  }

  function flagCell(task: TaskModel, enabled: boolean | undefined, marker: string): WbsXlsxCellLike {
    return {
      value: enabled ? marker : "",
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      bold: !!enabled,
      fillColor: task.summary ? PHASE_FILL : (task.milestone ? MILESTONE_FILL : undefined)
    };
  }

  function progressCell(task: TaskModel, value: number | undefined): WbsXlsxCellLike {
    const progressValue = formatProgressLabel(value);
    return {
      value: progressValue,
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      wrapText: true,
      bold: task.summary || task.milestone || false,
      fillColor: task.summary ? PHASE_FILL : (task.milestone ? MILESTONE_FILL : PROGRESS_COLUMN_FILL)
    };
  }

  function formatProgressLabel(value: number | undefined): string {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "";
    }
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const filled = Math.round(clamped / 10);
    const bar = `${"#".repeat(filled)}${"-".repeat(10 - filled)}`;
    return `${String(clamped).padStart(3, " ")}%\n[${bar}]`;
  }

  function formatDurationLabel(
    task: TaskModel,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>,
    useBusinessDaysForProgressBand: boolean | undefined
  ): string {
    if (useBusinessDaysForProgressBand) {
      const businessDays = enumerateBusinessDays(task.start, task.finish, holidaySet, nonWorkingDayTypes).length;
      return businessDays > 0 ? `${businessDays}営業日` : "-";
    }
    const calendarDays = buildDateBand(task.start, task.finish).length;
    return calendarDays > 0 ? `${calendarDays}日` : "-";
  }

  function formatWbsExportTimestamp(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    return `出力日時 ${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function dateNumberCell(
    day: string,
    currentDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>
  ): WbsXlsxCellLike {
    const isToday = isSameDay(day, currentDate);
    const isWeekendDay = isWeeklyNonWorkingDay(day, nonWorkingDayTypes);
    const isHoliday = holidaySet.has(day);
    const weekStart = isWeekStart(day);
    const monthStart = isMonthStart(day);
    return {
      value: formatDateValue(day),
      bold: true,
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      fillColor: isToday ? TODAY_BAND_FILL : (isHoliday ? HOLIDAY_BAND_FILL : (isWeekendDay ? WEEKEND_BAND_FILL : (monthStart ? MONTH_START_HEADER_FILL : (weekStart ? WEEK_START_BAND_FILL : HEADER_FILL))))
    };
  }

  function weekdayCell(
    day: string,
    currentDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>
  ): WbsXlsxCellLike {
    const isToday = isSameDay(day, currentDate);
    const isWeekendDay = isWeeklyNonWorkingDay(day, nonWorkingDayTypes);
    const isHoliday = holidaySet.has(day);
    const weekStart = isWeekStart(day);
    const monthStart = isMonthStart(day);
    const target = parseDateOnly(day);
    const dayType = target ? (target.getDay() === 0 ? 1 : target.getDay() + 1) : 0;
    const weekendHeaderFill = dayType === 7 ? SATURDAY_HEADER_FILL : (dayType === 1 ? SUNDAY_HEADER_FILL : WEEKEND_BAND_FILL);
    return {
      value: formatWeekdayValue(day),
      bold: true,
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      fillColor: isHoliday ? HOLIDAY_BAND_FILL : (isWeekendDay ? weekendHeaderFill : (isToday ? TODAY_BAND_FILL : (monthStart ? MONTH_START_HEADER_FILL : (weekStart ? WEEK_START_BAND_FILL : HEADER_FILL))))
    };
  }

  function dateBandCell(
    task: TaskModel,
    day: string,
    currentDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>,
    useBusinessDaysForProgressBand: boolean | undefined
  ): WbsXlsxCellLike {
    const isWeekendDay = isWeeklyNonWorkingDay(day, nonWorkingDayTypes);
    const isHoliday = holidaySet.has(day);
    const isNonWorkingDay = isWeekendDay || isHoliday;
    const isTaskStart = isSameDay(day, task.start);
    const isTaskFinish = isSameDay(day, task.finish);
    const active = includesDay(task.start, task.finish, day) && (!isNonWorkingDay || isTaskStart || isTaskFinish);
    const isToday = isSameDay(day, currentDate);
    const weekStart = isWeekStart(day);
    const complete = active && isCompletedDay(task, day, holidaySet, nonWorkingDayTypes, useBusinessDaysForProgressBand);
    return {
      value: active ? activeBandMarker(task, complete) : "",
      border: "thin",
      horizontalAlign: "center",
      verticalAlign: "center",
      fillColor: active
        ? (complete
          ? (isToday ? TODAY_PROGRESS_BAND_FILL : PROGRESS_BAND_FILL)
          : (isToday ? TODAY_ACTIVE_BAND_FILL : ACTIVE_BAND_FILL))
        : (isToday ? TODAY_BAND_FILL : (isHoliday ? HOLIDAY_BAND_FILL : (isWeekendDay ? WEEKEND_BAND_FILL : (weekStart ? WEEK_START_BAND_FILL : undefined))))
    };
  }

  function activeBandMarker(task: TaskModel, complete: boolean): string {
    if (task.summary) {
      return "━";
    }
    if (task.milestone) {
      return "◆";
    }
    return complete ? "■" : "□";
  }

  function countBusinessDays(dateBand: string[], holidaySet: Set<string>, nonWorkingDayTypes: Set<number>): number {
    return dateBand.filter((day) => !isWeeklyNonWorkingDay(day, nonWorkingDayTypes) && !holidaySet.has(day)).length;
  }

  function buildWeekBandRanges(dateBand: string[], startColumnIndex: number, rowNumber: number) {
    const ranges: Array<{ range: string; startIndex: number; label: string; hasMonthBoundary: boolean }> = [];
    if (dateBand.length === 0) {
      return ranges;
    }
    let chunkStart = 0;
    while (chunkStart < dateBand.length) {
      const weekStart = formatWeekKey(dateBand[chunkStart]);
      let chunkEnd = chunkStart;
      while (chunkEnd + 1 < dateBand.length && formatWeekKey(dateBand[chunkEnd + 1]) === weekStart) {
        chunkEnd += 1;
      }
      const chunkDays = dateBand.slice(chunkStart, chunkEnd + 1);
      ranges.push({
        range: WBS_LAYOUT.range(
          WBS_LAYOUT.reference(rowNumber, startColumnIndex + chunkStart),
          WBS_LAYOUT.reference(rowNumber, startColumnIndex + chunkEnd)
        ),
        startIndex: chunkStart,
        label: formatWeekLabel(weekStart, chunkDays),
        hasMonthBoundary: chunkDays.some((day) => isMonthStart(day))
      });
      chunkStart = chunkEnd + 1;
    }
    return ranges;
  }

  function includesDay(startDate: string | undefined, finishDate: string | undefined, day: string): boolean {
    const start = parseDateOnly(startDate);
    const finish = parseDateOnly(finishDate);
    const target = parseDateOnly(day);
    if (!start || !finish || !target) {
      return false;
    }
    return start.getTime() <= target.getTime() && target.getTime() <= finish.getTime();
  }

  function isCompletedDay(
    task: TaskModel,
    day: string,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>,
    useBusinessDaysForProgressBand: boolean | undefined
  ): boolean {
    const start = parseDateOnly(task.start);
    const finish = parseDateOnly(task.finish);
    const target = parseDateOnly(day);
    if (!start || !finish || !target) {
      return false;
    }
    if (useBusinessDaysForProgressBand) {
      const activeBusinessDays = enumerateBusinessDays(task.start, task.finish, holidaySet, nonWorkingDayTypes);
      if (activeBusinessDays.length === 0) {
        return false;
      }
      const percent = Math.max(0, Math.min(100, task.percentComplete || 0));
      const completedDays = Math.floor(activeBusinessDays.length * (percent / 100));
      const dayKey = formatDateOnly(target);
      const dayIndex = activeBusinessDays.indexOf(dayKey);
      return dayIndex >= 0 && dayIndex < completedDays;
    }
    const totalDays = Math.floor((finish.getTime() - start.getTime()) / 86400000) + 1;
    if (totalDays <= 0) {
      return false;
    }
    const percent = Math.max(0, Math.min(100, task.percentComplete || 0));
    const completedDays = Math.floor(totalDays * (percent / 100));
    const dayIndex = Math.floor((target.getTime() - start.getTime()) / 86400000);
    return dayIndex >= 0 && dayIndex < completedDays;
  }

  function enumerateBusinessDays(
    startDate: string | undefined,
    finishDate: string | undefined,
    holidaySet: Set<string>,
    nonWorkingDayTypes: Set<number>
  ): string[] {
    return buildDateBand(startDate, finishDate).filter((day) => !isWeeklyNonWorkingDay(day, nonWorkingDayTypes) && !holidaySet.has(day));
  }

  function isSameDay(day: string, other: string | undefined): boolean {
    return day === (other || "").slice(0, 10);
  }

  function isWeekStart(day: string): boolean {
    const target = parseDateOnly(day);
    if (!target) {
      return false;
    }
    return target.getDay() === 0;
  }

  function isMonthStart(day: string): boolean {
    const target = parseDateOnly(day);
    if (!target) {
      return false;
    }
    return target.getDate() === 1;
  }

  function formatDateValue(day: string): string {
    const target = parseDateOnly(day);
    if (!target) {
      return day;
    }
    return `${target.getMonth() + 1}/${target.getDate()}`;
  }

  function formatWeekdayValue(day: string): string {
    const target = parseDateOnly(day);
    if (!target) {
      return day;
    }
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays[target.getDay()];
  }

  function formatWeekKey(day: string): string {
    const target = parseDateOnly(day);
    if (!target) {
      return day;
    }
    const sunday = new Date(target.getTime());
    const offset = sunday.getDay();
    sunday.setDate(sunday.getDate() - offset);
    return formatDateOnly(sunday);
  }

  function formatWeekLabel(weekKey: string, days: string[]): string {
    if (days.length === 0) {
      return "週";
    }
    const start = parseDateOnly(weekKey);
    if (!start) {
      return weekKey;
    }
    const monthSet = new Set(days.map((day) => {
      const target = parseDateOnly(day);
      return target ? target.getMonth() : -1;
    }));
    const startLabel = `${String(start.getMonth() + 1).padStart(2, "0")}/${String(start.getDate()).padStart(2, "0")}`;
    if (monthSet.size <= 1) {
      return `週 ${startLabel}`;
    }
    const tailMonths = Array.from(monthSet)
      .filter((monthIndex) => monthIndex >= 0 && monthIndex !== start.getMonth())
      .map((monthIndex) => String(monthIndex + 1).padStart(2, "0"));
    return `週 ${startLabel} / ${tailMonths.join(" / ")}`;
  }

  (globalThis as typeof globalThis & {
    __mikuprojectWbsXlsx?: {
      collectWbsHolidayDates: typeof collectWbsHolidayDates;
      exportWbsWorkbook: typeof exportWbsWorkbook;
      layout: WbsSheetLayoutHelper;
    };
  }).__mikuprojectWbsXlsx = {
    collectWbsHolidayDates,
    exportWbsWorkbook,
    layout: WBS_LAYOUT
  };
})();
