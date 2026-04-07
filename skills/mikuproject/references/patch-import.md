# Patch Import

Use this reference when the user provides AI output that should be treated as `Patch JSON`.

## Base State Requirement

`Patch JSON` cannot be applied by itself.
Require an existing `mikuproject_workbook_json` and rebuild a base `ProjectModel` from it first.

Use:

- `globalThis.__mikuprojectCoreApi.workbookJson.importAsProjectModel(documentLike)`

to create the base model from the current workbook state.

## Acceptance Rule

Accept either:

- raw JSON text
- a full LLM response that ends with a `json` fenced block

Prefer:

- `globalThis.__mikuprojectCoreApi.importAiJsonText(sourceText, { baseModel })`

or, if the document is already parsed:

- `globalThis.__mikuprojectCoreApi.importAiJsonDocument(documentLike, { baseModel })`

## Required Kind

The detected document kind must be `patch_json`.

If the detected kind is:

- `project_draft_view`: reject it and treat it as a draft flow
- `workbook_json`: reject it and treat it as a workbook flow
- `undefined`: return a hard error

If `baseModel` is missing, return a hard error.

## Processing Flow

1. Require current workbook state
2. Import workbook JSON as a base `ProjectModel`
3. Parse source text and detect kind
4. Apply the patch through the core API with `baseModel`
5. Confirm the result mode is `patch`
6. Export the resulting model with `__mikuprojectCoreApi.workbookJson.exportDocument()`
7. Return the updated workbook JSON

## Minimum Validation Expectation

Rely on upstream validation for structural checks and operation handling.
At the skill level, ensure only these minimum conditions:

- the payload parses as JSON after fenced-block extraction
- the detected kind is `patch_json`
- a base workbook state exists
- patch application succeeds without a hard error

## Default Return Shape

Return in this order:

1. One short line:
   `Patch JSON を反映しました。`
2. Warnings if any exist
3. A short change summary
4. The updated `mikuproject_workbook_json`

If the patch produces no changes, say that no changes were applied.
Do not fabricate a changed workbook state when application fails.
