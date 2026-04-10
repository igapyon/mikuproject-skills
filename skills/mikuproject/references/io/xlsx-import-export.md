# XLSX Import/Export

Use this reference when the user wants to move between workbook `XLSX` and the current `mikuproject` state.

This reference is for the structural workbook `XLSX`, not `WBS XLSX`.

## Upstream API

Prefer these functions:

- `__mikuprojectCoreApi.xlsx.decodeWorkbook(bytes)`
- `__mikuprojectCoreApi.xlsx.encodeWorkbook(workbook)`
- `__mikuprojectCoreApi.xlsx.exportWorkbook(model)`
- `__mikuprojectCoreApi.xlsx.importAsProjectModel(workbook)`
- `__mikuprojectCoreApi.xlsx.importIntoProjectModel(workbook, baseModel)`
- `__mikuprojectCoreApi.importExternal(...)`

## `xlsx-import`

Purpose:

- read workbook `XLSX`
- normalize it into the skill state
- return `mikuproject_workbook_json`

Processing order:

1. accept `.xlsx` bytes
2. for replace import, use either:
   - `xlsx.decodeWorkbook(bytes)` then `xlsx.importAsProjectModel(workbook)`
   - or `importExternal({ source: { format: "xlsx", bytes }, mode: "replace" })`
3. validate the resulting `ProjectModel` when useful
4. export it with `workbookJson.exportDocument`
5. return the resulting `mikuproject_workbook_json`

Response shape:

- one short line saying the workbook `XLSX` was accepted or rejected
- warnings, if any
- the resulting `mikuproject_workbook_json`

## `xlsx-merge-import`

Purpose:

- apply workbook `XLSX` edits onto an existing state

Processing order:

1. require the current workbook state
2. rebuild `baseModel` from the current state
3. call `importExternal({ source: { format: "xlsx", bytes }, mode: "merge", baseModel })`
4. export the resulting model with `workbookJson.exportDocument`
5. return the updated `mikuproject_workbook_json`

Response shape:

- one short line saying the workbook `XLSX` merge was applied or rejected
- warnings, if any
- short change summary
- the updated `mikuproject_workbook_json`

## `xlsx-export`

Purpose:

- take the current state
- return structural workbook `XLSX`

Processing order:

1. require the current state
2. rebuild `ProjectModel` from `mikuproject_workbook_json` if needed
3. create workbook data with `xlsx.exportWorkbook(model)`
4. encode it with `xlsx.encodeWorkbook(workbook)`
5. return the bytes as the export result

Response shape:

- one short line saying this is the current workbook `XLSX`
- workbook sheet summary, when useful
- the generated `.xlsx` bytes or file artifact

## Errors

Hard errors:

- `.xlsx` bytes cannot be decoded
- current state is missing for export or merge import

Soft errors:

- unsupported workbook edits are ignored
- partial changes are applied
- validation returns warnings
