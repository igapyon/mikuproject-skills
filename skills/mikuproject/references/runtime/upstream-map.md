# Upstream Map

Use this reference when you need the exact `mikuproject` runtime locations behind the MVP workflow.

## Preferred Runtime Search Order

When this skill is running from a distributed `skill-bundle`, check this location first:

- `skills/mikuproject/runtime/mikuproject-cli-bundle`

When this skill is running from the development repository, use:

- `vendor/mikuproject`

Do not treat a missing top-level `vendor/mikuproject` as immediate failure in bundle installs.
Check the bundled `runtime/mikuproject-cli-bundle` location first when available.

## Stable API Entry Points

- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/ai-json-spec.js`
  - bundled install location
- `vendor/mikuproject/src/ts/ai-json-spec.ts`
  - development repository location
  - exposes `globalThis.__mikuprojectAiJsonSpec`
- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/core-api.js`
  - bundled install location
- `vendor/mikuproject/src/ts/core-api.ts`
  - development repository location
  - exposes `globalThis.__mikuprojectCoreApi`

## Main Formats

- `vendor/mikuproject/docs/mikuproject-ai-json-spec.md`
  - development repository location
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

- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/ai-json-util.js`
  - bundled install location
- `vendor/mikuproject/src/ts/ai-json-util.ts`
  - development repository location
  - extracts the final fenced JSON block
  - detects `workbook_json`, `project_draft_view`, and `patch_json`
- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/msproject-xml.js`
  - bundled install location
- `vendor/mikuproject/src/ts/msproject-xml.ts`
  - development repository location
  - contains `importProjectDraftView`
- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/project-workbook-json.js`
  - bundled install location
- `vendor/mikuproject/src/ts/project-workbook-json.ts`
  - development repository location
  - contains workbook JSON import/export
- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/project-patch-json.js`
  - bundled install location
- `vendor/mikuproject/src/ts/project-patch-json.ts`
  - development repository location
  - contains Patch JSON validation and apply logic
- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/project-xlsx.js`
  - bundled install location
- `vendor/mikuproject/src/ts/project-xlsx.ts`
  - development repository location
  - contains structural workbook `XLSX` import/export
- `skills/mikuproject/runtime/mikuproject-cli-bundle/src/js/excel-io.js`
  - bundled install location
- `vendor/mikuproject/src/ts/excel-io.ts`
  - development repository location
  - contains workbook binary encode/decode

## Working Assumption

For the MVP, prefer `mikuproject_workbook_json` at the conversation boundary.
Convert to `ProjectModel` internally and to `MS Project XML` only when needed.
