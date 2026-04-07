# Upstream Map

Use this reference when you need the exact vendored `mikuproject` locations behind the MVP workflow.

## Stable API Entry Points

- `vendor/mikuproject/src/ts/ai-json-spec.ts`
  - exposes `globalThis.__mikuprojectAiJsonSpec`
- `vendor/mikuproject/src/ts/core-api.ts`
  - exposes `globalThis.__mikuprojectCoreApi`

## Main Formats

- `vendor/mikuproject/docs/mikuproject-ai-json-spec.md`
  - canonical AI JSON prompt/spec document
- `MS Project XML`
  - imported through `__mikuprojectCoreApi.msProject.importFromXml()`
  - exported through `__mikuprojectCoreApi.msProject.exportToXml()`
- workbook `XLSX`
  - handled through `__mikuprojectCoreApi.xlsx.*`
  - or `__mikuprojectCoreApi.importExternal(...)`
- `project_draft_view`
  - imported through `__mikuprojectCoreApi.importAiJsonDocument()` or `importAiJsonText()`
- `Patch JSON`
  - imported through `__mikuprojectCoreApi.importAiJsonDocument()` or `importAiJsonText()`
- `mikuproject_workbook_json`
  - exported through `__mikuprojectCoreApi.workbookJson.exportDocument()`
  - imported through `__mikuprojectCoreApi.workbookJson.importAsProjectModel()`

## Lower-Level Implementation Files

- `vendor/mikuproject/src/ts/ai-json-util.ts`
  - extracts the final fenced JSON block
  - detects `workbook_json`, `project_draft_view`, and `patch_json`
- `vendor/mikuproject/src/ts/msproject-xml.ts`
  - contains `importProjectDraftView`
- `vendor/mikuproject/src/ts/project-workbook-json.ts`
  - contains workbook JSON import/export
- `vendor/mikuproject/src/ts/project-patch-json.ts`
  - contains Patch JSON validation and apply logic
- `vendor/mikuproject/src/ts/project-xlsx.ts`
  - contains structural workbook `XLSX` import/export
- `vendor/mikuproject/src/ts/excel-io.ts`
  - contains workbook binary encode/decode

## Working Assumption

For the MVP, prefer `mikuproject_workbook_json` at the conversation boundary.
Convert to `ProjectModel` internally and to `MS Project XML` only when needed.
