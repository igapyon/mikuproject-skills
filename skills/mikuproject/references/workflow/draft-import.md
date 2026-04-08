# Draft Import

Use this reference when the user provides AI output that should be treated as `project_draft_view`.

## Acceptance Rule

Accept either:

- raw JSON text
- a full LLM response that ends with a `json` fenced block

Prefer:

- `globalThis.__mikuprojectCoreApi.importAiJsonText(sourceText)`

or, if the document is already parsed:

- `globalThis.__mikuprojectCoreApi.importAiJsonDocument(documentLike)`

## Required Kind

The detected document kind must be `project_draft_view`.

If the detected kind is:

- `patch_json`: reject it and treat it as a patch flow
- `workbook_json`: reject it and treat it as a workbook flow
- `undefined`: return a hard error

## Processing Flow

1. Parse source text and detect kind
2. Import with the core API
3. Confirm the result mode is `replace`
4. Take the returned `ProjectModel`
5. Export it with `__mikuprojectCoreApi.workbookJson.exportDocument()`
6. keep the workbook JSON in internal state when possible
7. only return raw workbook JSON when the user explicitly wants the raw state, or when the host runtime requires fallback display

## Minimum Validation Expectation

Rely on upstream validation for structural checks.
At the skill level, ensure only these minimum conditions:

- the payload parses as JSON after fenced-block extraction
- the detected kind is `project_draft_view`
- import succeeds without a hard error

## Default Return Shape

Return in this order:

1. One short line:
   `project_draft_view を取り込みました。`
2. Warnings if any exist
3. The resulting `mikuproject_workbook_json`, only when raw state display is needed

If import fails, return a short error explanation and do not fabricate a partial workbook state.
