# Workbook Handoff

Use this reference when the user wants to hand the current WBS state to another AI.

## Retrieval Rule

If you already have current state as `mikuproject_workbook_json`, return it directly.

If you have current state as `ProjectModel`, export it with:

- `globalThis.__mikuprojectCoreApi.workbookJson.exportDocument(model)`

## Default Return Shape

Return three parts in this order:

1. One short line:
   `現在の WBS 状態を mikuproject_workbook_json として示します。`
2. The full `mikuproject_workbook_json`
3. One short prompt for the next AI turn when useful

## Minimal Prompt Examples

### For general iterative editing

`次に与える mikuproject_workbook_json を受け取り、変更提案を Patch JSON 形式で返してください。`

### For schedule tightening

`次に与える mikuproject_workbook_json を受け取り、日程の見直し案を Patch JSON 形式で返してください。`

### For md-first AI-driven planning

`次に与える mikuproject_workbook_json を受け取り、md準備を先行させる前提で変更提案を Patch JSON 形式で返してください。`

## Short Conversation Example

User intent:

- current WBS を別の AI に渡して改善提案をもらいたい

Skill output shape:

1. `現在の WBS 状態を mikuproject_workbook_json として示します。`
2. workbook JSON
3. `次に与える mikuproject_workbook_json を受け取り、変更提案を Patch JSON 形式で返してください。`
