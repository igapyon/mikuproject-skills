---
name: mikuproject
description: Work with mikuproject AI JSON workflows, primary file import/export workflows, and Phase C report outputs. Use when Codex needs to provide the mikuproject AI JSON spec, accept `project_draft_view`, apply `Patch JSON`, hand off `mikuproject_workbook_json`, move between the current state and `MS Project XML` or structural workbook `XLSX`, or export `WBS XLSX` / `SVG` / `WBS Markdown` / `Mermaid`.
---

# Mikuproject

Use this skill to drive the current workflow for `mikuproject` Agent Skills.
Keep the focus on structured exchange and primary file workflows, not on replacing the browser UI.

## Default Mode

The default mode should be agent-internal.

This means:

- keep `spec`, `project_draft_view`, `Patch JSON`, and `mikuproject_workbook_json` in internal state when possible
- do not show intermediate artifacts to the user unless the user explicitly asks to see them
- only show final summaries or final exports by default

If the host runtime cannot keep intermediate outputs internal, fall back to handoff-style display.
That fallback is allowed, but it is not the preferred user experience.

Visible handoff text is therefore a compatibility path, not the main path.

## Core Workflow

Treat the skill as one workflow with three layers of operations.

Phase A:

- `spec`: provide `mikuproject-ai-json-spec`
- `draft`: accept AI-produced `project_draft_view`
- `patch`: accept AI-produced `Patch JSON`
- `workbook`: return current `mikuproject_workbook_json`

Phase B:

- `xml-import`: accept `MS Project XML` and return `mikuproject_workbook_json`
- `xml-export`: return current `MS Project XML`
- `xlsx-import`: accept structural workbook `XLSX` and return `mikuproject_workbook_json`
- `xlsx-merge-import`: apply structural workbook `XLSX` edits onto an existing state
- `xlsx-export`: return current structural workbook `XLSX`
- `workbook-import`: accept `mikuproject_workbook_json` as a replace import
- `workbook-merge-import`: apply `mikuproject_workbook_json` onto an existing state
- `workbook-export`: return current `mikuproject_workbook_json` as a file-oriented export

Phase C:

- `wbs-xlsx-export`: return current `WBS XLSX`
- `daily-svg-export`: return current daily `SVG`
- `weekly-svg-export`: return current weekly `SVG`
- `monthly-calendar-svg-export`: return current monthly calendar `SVG` entries
- `wbs-markdown-export`: return current `WBS Markdown`
- `mermaid-export`: return current Mermaid gantt text

At the conversation boundary, prefer `mikuproject_workbook_json` as the state exchange format.
When processing input, convert through upstream APIs as needed.
This means the MVP passes state around as `mikuproject_workbook_json`, rather than relying on a persistent in-skill runtime state store.

## Upstream Entry Points

Prefer the reusable upstream APIs exposed by the vendored `mikuproject`.
Use these before falling back to direct file reads or UI-oriented flows.

- `globalThis.__mikuprojectAiJsonSpec`
- `globalThis.__mikuprojectCoreApi`

Use these functions first:

- `getAiJsonSpecText()`
- `getAiJsonSpec()`
- `parseAiJsonText()`
- `importAiJsonDocument()`
- `importAiJsonText()`
- `importExternal()`
- `msProject.importFromXml()`
- `msProject.exportToXml()`
- `workbookJson.exportDocument()`
- `workbookJson.importAsProjectModel()`
- `workbookJson.importIntoProjectModel()`
- `xlsx.decodeWorkbook()`
- `xlsx.encodeWorkbook()`
- `xlsx.exportWorkbook()`
- `xlsx.importAsProjectModel()`
- `xlsx.importIntoProjectModel()`
- `patchJson.applyToProjectModel()`
- `report.wbsXlsx.exportWorkbook()`
- `report.wbsXlsx.exportBytes()`
- `report.svg.exportDaily()`
- `report.svg.exportWeekly()`
- `report.svg.exportMonthlyCalendar()`
- `report.wbsMarkdown.export()`
- `report.mermaid.exportGantt()`

If you need the exact upstream file map or supporting design notes, read [references/upstream-map.md](references/upstream-map.md).

## Operation Rules

### `spec`

Get the spec from `getAiJsonSpecText()` or `getAiJsonSpec()` first.
When the user explicitly asks to see the spec, return the full `mikuproject-ai-json-spec` text and, when useful, its version.
Otherwise, prefer using it internally and continue the workflow without showing the full spec text.

When the user explicitly asks to see the spec, use this response shape:

- one short line explaining that this is the `mikuproject-ai-json-spec`
- the spec text itself
- one short line telling the user what to ask the next AI to do

Do not rewrite or summarize the spec unless the user explicitly asks for a summary.
The default behavior is to keep the upstream text internal when possible.
If internal execution is available, do not print the full spec text by default.

### `draft`

Accept either raw JSON or a full response containing a final `json` fenced block.
Detect the document kind from content.
Use `importAiJsonText()` or `importAiJsonDocument()` and require the detected kind to be `project_draft_view`.
Treat this as a replace flow, not a patch flow.
Import `project_draft_view`, convert it to a project state, and return the resulting `mikuproject_workbook_json`.

Use this processing order:

1. parse source text and detect the document kind
2. reject the input unless the kind is `project_draft_view`
3. import it through the upstream core API
4. export the resulting state as `mikuproject_workbook_json`
5. report success or failure

Use this response shape:

- one short line saying the draft was accepted or rejected
- warnings, if any
- the resulting `mikuproject_workbook_json`, only when the user explicitly wants the raw state

If the user did not ask to see raw workbook JSON, prefer returning a short success summary and keep the workbook state internal.

When the import succeeds, keep the explanation short.
Do not add speculative schedule corrections or WBS advice unless the user asks for review.

### `patch`

Require an existing workbook state before applying `Patch JSON`.
Rebuild the base `ProjectModel` from the current `mikuproject_workbook_json` first.
Use `importAiJsonText()` or `importAiJsonDocument()` with `baseModel` and require the detected kind to be `patch_json`.
Apply the patch, keep warnings, summarize changes, and return the updated `mikuproject_workbook_json`.

Use this processing order:

1. require the current workbook state
2. import the workbook state as a base `ProjectModel`
3. parse source text and detect the document kind
4. reject the input unless the kind is `patch_json`
5. apply the patch through the upstream core API with `baseModel`
6. export the resulting state as `mikuproject_workbook_json`
7. return the change summary and the updated workbook JSON

Use this response shape:

- one short line saying the patch was applied or rejected
- warnings, if any
- short change summary
- the updated `mikuproject_workbook_json`, only when the user explicitly wants the raw state

If no changes were applied, say so explicitly and still report any warnings.
If the user did not ask to see raw workbook JSON, prefer returning a short success summary and keep the updated state internal.

### `workbook`

Return the current `mikuproject_workbook_json` in a form the user can pass to another AI.
If the current state is still a `ProjectModel`, export it with `workbookJson.exportDocument()`.
When useful, add one short prompt telling the next AI to respond with `Patch JSON`.

Do not return raw workbook JSON unless one of these is true:

- the user explicitly asks for workbook JSON
- the host runtime requires handoff-style display

Use this processing order:

1. require the current state
2. if needed, convert the current state into `mikuproject_workbook_json`
3. keep the workbook JSON in internal state by default
4. return the workbook JSON only when the user explicitly wants it or fallback display is required
5. add one short handoff prompt only when visible handoff is actually being used

Use this response shape:

- one short line saying this is the current workbook state
- the `mikuproject_workbook_json`
- one short prompt for the next AI turn, when useful

Do not add extra review comments unless the user asks for review.
Do not call this operation just to move state between internal steps when the host runtime can already keep the workbook state internally.

### Phase C report exports

Require a current project state before running any report export.
If the current state is `mikuproject_workbook_json`, rebuild a `ProjectModel` first.
Prefer the unified `report` entrypoints on `__mikuprojectCoreApi`.

Supported operations:

- `wbs-xlsx-export`: use `report.wbsXlsx.exportBytes()` for file export, or `report.wbsXlsx.exportWorkbook()` when workbook-level inspection is needed
- `daily-svg-export`: use `report.svg.exportDaily()`
- `weekly-svg-export`: use `report.svg.exportWeekly()`
- `monthly-calendar-svg-export`: use `report.svg.exportMonthlyCalendar()`
- `wbs-markdown-export`: use `report.wbsMarkdown.export()`
- `mermaid-export`: use `report.mermaid.exportGantt()`

Use this processing order:

1. require the current state
2. convert `mikuproject_workbook_json` into a base `ProjectModel` when needed
3. choose the matching `report.*` export entrypoint
4. run the export with minimal options unless the user asked for specific export controls
5. return the generated artifact or text with one short explanation

Use this response shape:

- one short line saying which report export this is
- option summary, only when relevant
- the generated artifact, text, or entry list

For Phase C outputs, keep the distinction clear:

- `WBS XLSX` is a report export and is not the same as structural workbook `XLSX`
- `Mermaid` should be returned as gantt text, not necessarily fenced Markdown, unless the user asks for fencing
- monthly calendar `SVG` may return multiple entries rather than a single file

## Error Handling

Treat these as hard errors:

- source text is not valid JSON after extracting the final fenced block
- document kind cannot be detected
- `Patch JSON` is provided without a base state
- required fields for `project_draft_view` or workbook JSON are missing

Treat these as soft errors:

- upstream validation checks return warnings
- some patch operations are ignored
- workbook JSON contains unknown sheets or columns
- unsupported workbook `XLSX` edits are ignored
- merge imports apply only partial changes
- some report export options may be rounded to upstream defaults
- report outputs may simplify information compared with the full interactive UI

On soft errors, continue and report the warnings clearly.
Keep the warnings concise when the workflow is agent-internal and the user did not ask for raw intermediate detail.

## Boundaries

Do not overreach beyond the MVP.

- Do not pretend to replace `mikuproject` browser-side visual review
- Do not claim business validity of the WBS itself
- Do not add MCP-specific behavior unless the user asks for that expansion
- Do not introduce extra skill splits unless the current single-skill design becomes limiting
- Do not confuse structural workbook `XLSX` with `WBS XLSX`
- Do not prefer visible handoff output when hidden internal execution is available

## References

Read these only when needed:

- [references/upstream-map.md](references/upstream-map.md) for upstream file and API locations
- [references/spec-handoff.md](references/spec-handoff.md) for `spec` return rules and minimal prompt examples
- [references/draft-import.md](references/draft-import.md) for `project_draft_view` acceptance and conversion rules
- [references/patch-import.md](references/patch-import.md) for `Patch JSON` acceptance and apply rules
- [references/workbook-handoff.md](references/workbook-handoff.md) for `mikuproject_workbook_json` handoff rules and prompt examples
- [references/xml-import-export.md](references/xml-import-export.md) for `MS Project XML` import/export rules
- [references/xlsx-import-export.md](references/xlsx-import-export.md) for structural workbook `XLSX` import/export rules
- [references/workbook-import-export.md](references/workbook-import-export.md) for file-style workbook JSON import/export rules
- [references/phase-b-examples.md](references/phase-b-examples.md) for short `xml/xlsx/workbook` import/export examples
