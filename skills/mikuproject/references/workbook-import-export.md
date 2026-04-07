# Workbook JSON Import/Export

Use this reference when the user wants file-style import/export around `mikuproject_workbook_json`.

This is different from the Phase A handoff use case because the focus here is primary file workflow.

## Upstream API

Prefer these functions:

- `__mikuprojectCoreApi.workbookJson.exportDocument(model)`
- `__mikuprojectCoreApi.workbookJson.importAsProjectModel(documentLike)`
- `__mikuprojectCoreApi.workbookJson.importIntoProjectModel(documentLike, baseModel)`
- `__mikuprojectCoreApi.workbookJson.validateDocument(documentLike)`

## `workbook-import`

Purpose:

- replace the current state from a workbook JSON document

Processing order:

1. accept workbook JSON
2. validate it when useful
3. import it with `workbookJson.importAsProjectModel`
4. export it again with `workbookJson.exportDocument`
5. return the normalized `mikuproject_workbook_json`

Response shape:

- one short line saying the workbook JSON was accepted or rejected
- warnings, if any
- the resulting `mikuproject_workbook_json`

## `workbook-merge-import`

Purpose:

- apply workbook JSON changes onto an existing state

Processing order:

1. require the current workbook state
2. rebuild `baseModel` from the current state
3. call `workbookJson.importIntoProjectModel(documentLike, baseModel)`
4. export the resulting model with `workbookJson.exportDocument`
5. return the updated `mikuproject_workbook_json`

Response shape:

- one short line saying the workbook JSON merge was applied or rejected
- warnings, if any
- short change summary
- the updated `mikuproject_workbook_json`

## `workbook-export`

Purpose:

- return the current state as `mikuproject_workbook_json`

Processing order:

1. require the current state
2. if needed, rebuild `ProjectModel`
3. export it with `workbookJson.exportDocument`
4. return the resulting `mikuproject_workbook_json`

Response shape:

- one short line saying this is the current workbook JSON export
- the resulting `mikuproject_workbook_json`
