---
name: mikuproject
description: Use mikuproject as a WBS planning tool for AI. It gives the agent a structured way to draft plans, revise existing plans, keep project state, and export results as workbook JSON, XML, XLSX, WBS Markdown, or Mermaid.
---

# Mikuproject

`mikuproject` is a project-planning tool that gives an AI agent three things:

- a structured way to draft a new WBS
- a structured way to revise an existing WBS
- a way to keep project state and convert it into useful output formats

Use this skill when the agent should think about planning, while `mikuproject` handles state, import/apply, and export.
Keep the focus on WBS planning workflows and state conversion, not on replacing the browser UI.

For this skill, `mikuproject` should be opt-in by default.
Do not trigger `mikuproject` from planning words or export-format words alone.

Start `mikuproject` mode when at least one of these explicit triggers is present:

- the user names `mikuproject`
- the user writes `miku project`
- the recent conversation is already in an active `mikuproject` workflow from an earlier explicit trigger

Without one of these triggers, do not force `mikuproject` just because the request mentions `WBS`, `スケジュール`, `工程`, `計画`, `Excel`, `xlsx`, `画像`, `SVG`, `Mermaid`, `ガント`, or similar words.
In that case, either answer normally or ask a brief clarifying question.

Once `mikuproject` mode is active, prefer to keep handling follow-up work through `mikuproject` interfaces as long as that remains a reasonable fit.
Inside an active `mikuproject` workflow:

- prefer `draft`, `patch`, `workbook`, import, and export operations over ad-hoc reformats
- treat follow-up requests as part of the same workbook-oriented flow unless the user clearly exits that context
- do not fall back to plain Markdown tables, hand-written gantt text, or one-off conversion code when the `mikuproject` interface can handle the request cleanly
- resolve ambiguous format words in `mikuproject` terms when that is the most natural continuation of the current workflow
- do not turn a normal WBS request into a runtime-inspection task unless the actual import or export path has failed

## Default Mode

The default mode should be agent-internal.

This means:

- keep `spec`, `project_draft_view`, `Patch JSON`, and `mikuproject_workbook_json` in internal state when possible
- do not show intermediate artifacts to the user unless the user explicitly asks to see them
- only show final summaries or final exports by default

If the host runtime cannot keep intermediate outputs internal, fall back to handoff-style display.
That fallback is allowed, but it is not the preferred user experience.

Visible handoff text is therefore a compatibility path, not the main path.

## Response Discipline

When the user asks for a WBS, schedule draft, or plan revision, do the internal `mikuproject` steps yourself when possible.
Do not stop at "here is something you can hand to mikuproject" if this skill is already active.

Prefer this sequence:

1. understand the user intent
2. retrieve the spec internally when needed
3. produce `project_draft_view` or `Patch JSON` internally
4. import or apply it through `mikuproject`
5. keep the resulting workbook state internal
6. show the user only a short summary, or a final export they explicitly asked for

Do not default to any of these behaviors:

- showing `project_draft_view` just because you created it
- showing `Patch JSON` just because you created it
- saying "Below is ..." or "以下を mikuproject に渡せます" unless visible handoff is truly required
- asking the user to manually pass generated JSON back into the same active skill flow
- answering a WBS request with only a plain Markdown table when `mikuproject` drafting or export should be used first

If the skill is active and the host runtime can continue internally, complete the import/apply step before responding.
Only expose intermediate JSON when one of these is true:

- the user explicitly asks to inspect the raw JSON
- the host runtime cannot continue without visible handoff
- debugging the intermediate artifact is necessary to explain a failure

## New Draft vs Existing Edit

Use these modes strictly:

- new WBS drafting: produce `project_draft_view`
- existing plan revision: produce `Patch JSON`

When the user is starting a new WBS from rough requirements, do not switch to existing-project editing flows.
In particular, do not default to:

- `task_edit_view`
- `phase_detail_view`
- `project_overview_view`
- generic `.editjson` handoff wording

For this skill, `.editjson` is not the primary conversation concept.
If a raw file extension must be mentioned, be explicit about the document kind:

- new draft import: `project_draft_view`
- existing revision: `Patch JSON`

Do not describe a new-draft response as "editjson" unless the user explicitly asks about file naming or upstream UI file handling.

## Export Discipline

When the user asks to convert the current draft or state into a deliverable format, use the matching `mikuproject` export operation directly.
When the user asks for a WBS, roadmap, gantt, schedule table, or planning output and does not name a different tool, prefer `mikuproject` as the first implementation path.
For ambiguous report-style requests, prefer `WBS Markdown` first.
Do not treat `Mermaid` as the default report format unless the user explicitly asks for it or clearly needs Mermaid-compatible text.

Map normal user requests like this:

- "report で出して" -> prefer `wbs-markdown-export`
- "見やすく出して" -> prefer `wbs-markdown-export`
- "共有しやすい形で出して" -> prefer `wbs-markdown-export`
- "markdown化して" -> `wbs-markdown-export`
- "Mermaid 化して" -> `mermaid-export`
- "svg にして" -> ask or infer `daily-svg-export` / `weekly-svg-export` / `monthly-calendar-svg-export` from the requested time scale
- "xlsx にして" -> `wbs-xlsx-export` or `xlsx-export`, depending on whether the user wants a report workbook or a structural workbook
- "Excel ガントが欲しい" -> prefer `wbs-xlsx-export`
- "xlsx でガントが欲しい" -> prefer `wbs-xlsx-export`
- "xml にして" -> `xml-export`

When the user asks for an Excel gantt, Excel schedule, or xlsx gantt in normal conversation, treat that as a request for `mikuproject` `WBS XLSX` unless the user explicitly asks for the structural workbook.
When the user asks only for a generic report, generic export, or a human-readable deliverable, use `WBS Markdown` unless another target format is explicitly requested.
Inside an active `mikuproject` workflow, treat short format requests like `markdown`, `xlsx`, `svg`, and `mermaid` as requests for the corresponding `mikuproject` exports unless the surrounding context clearly points somewhere else.
When the user asks for all report outputs, a full report set, or a bundled deliverable such as `全部`, `一式`, or `まとめて`, prefer the upstream `report all` export.
Treat that as the canonical implementation path instead of assembling a local custom bundle in the skill.

Use keyword-level routing like this:

- spreadsheet-like words such as `Excel`, `xlsx`, `xls`, `スプレッド`, `スプレッドシート` -> prefer `wbs-xlsx-export`
- image-like words such as `画像`, `図`, `ビジュアル`, `見た目`, `表示` -> prefer `SVG`
- `Mermaid` -> `mermaid-export`

For `ガント` or `ガントチャート`, do not assume `Mermaid` by default.
Resolve it in this order:

1. if spreadsheet-like words are also present, prefer `wbs-xlsx-export`
2. if image-like words are also present, prefer `SVG`
3. if `Mermaid` is explicitly present, use `mermaid-export`
4. otherwise, prefer `wbs-xlsx-export`

For `SVG`, choose by time scale when possible:

- `日`, `日次`, `daily` -> `daily-svg-export`
- `週`, `週次`, `weekly` -> `weekly-svg-export`
- `月`, `月間`, `monthly`, `calendar` -> `monthly-calendar-svg-export`

If the user asks for `SVG` or image-like output without a clear time scale, ask briefly or make the smallest reasonable inference from nearby wording.

Do not default to ad-hoc helper code for these requests.
In normal skill operation, do not:

- create `tmp/*.mjs` helper scripts
- create one-off local converters just to bridge into the runtime
- probe unrelated spreadsheet libraries such as `openpyxl` before using the built-in `mikuproject` export path
- switch from skill flow to manual file transformation when the matching export operation already exists
- replace a normal WBS flow with a generic Markdown table just because it is faster to print

If the matching runtime export cannot run because a required dependency is missing, report that dependency problem briefly.
When CLI execution is needed in a bundled environment, try the self-contained CLI bundle path before concluding that a dependency such as `jsdom` is missing.
Do not replace the failed export path with a hand-written conversion script unless the user explicitly asks for that fallback.

## Output Location Rules

Unless the user explicitly requests another location, write generated files under the workspace-local `mikuproject/` tree.
Do not write generated deliverables to the workspace root.
Do not place user-facing artifacts inside the skill runtime directory.

Use these default locations:

- state-like artifacts -> `mikuproject/state/`
- final report exports -> `mikuproject/report/`
- temporary intermediate files -> `mikuproject/tmp/`

Treat these as the standard mapping:

- `project_draft_view` -> `mikuproject/state/`
- `Patch JSON` -> `mikuproject/state/`
- `mikuproject_workbook_json` -> `mikuproject/state/`
- WBS Markdown, Mermaid, WBS XLSX, daily SVG, weekly SVG, monthly calendar ZIP -> `mikuproject/report/`
- ad-hoc scratch files that are not final deliverables -> `mikuproject/tmp/`

For bundled all-report requests:

- prefer one upstream-generated archive such as `YYYYMMDDHHmm-report-bundle.zip`
- use `report all` when that public entrypoint is available
- treat the bundle contents according to upstream semantics rather than inventing a separate local bundle layout

Use a timestamp prefix in file names by default:

- `YYYYMMDDHHmm-<kind>.<ext>`

When one user request produces multiple related artifacts, reuse the same timestamp prefix for that run.
If the target directories do not exist, create them first.

When invoking `mikuproject` CLI for a file-producing operation, pass an explicit `--out` path under this output tree whenever the command supports it.
Do not rely on default current-directory output for generated deliverables.

Forbidden defaults:

- workspace root outputs such as `./foo.svg` or `./bar.xlsx`
- saving generated artifacts under `skills/mikuproject/runtime/...`
- scattering multiple generations by incrementing suffixes in the root such as `-2`, `-gw2`, or similar

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
- `all-report-export`: return current report bundle `ZIP`
- `wbs-markdown-export`: return current `WBS Markdown`
- `mermaid-export`: return current Mermaid gantt text

At the conversation boundary, prefer `mikuproject_workbook_json` as the state exchange format.
When processing input, convert through upstream APIs as needed.
This means the MVP passes state around as `mikuproject_workbook_json`, rather than relying on a persistent in-skill runtime state store.

## Upstream Entry Points

Prefer the reusable upstream APIs exposed by the vendored `mikuproject`.
Use these before falling back to direct file reads or UI-oriented flows.

When this skill is installed from `skill-bundle`, prefer the bundled runtime first:

- `skills/mikuproject/runtime/mikuproject-cli-bundle`

When working in the development repository, the source location is:

- `vendor/mikuproject`

Do not search broadly for alternate copies before checking these expected locations.
In distributed environments, treat `skills/mikuproject/runtime/mikuproject-cli-bundle` as the primary bundled runtime location.
When bundled execution is needed, prefer `skills/mikuproject/runtime/mikuproject-cli-bundle` before any non-bundled path.

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
- `report.all.export()`
- `report.wbsMarkdown.export()`
- `report.mermaid.exportGantt()`

If you need the exact upstream file map or supporting design notes, read [references/upstream-map.md](references/upstream-map.md).

## Operation Rules

### `spec`

Get the spec from `getAiJsonSpecText()` or `getAiJsonSpec()` first.
When the user explicitly asks to see the spec, return the full `mikuproject-ai-json-spec` text and, when useful, its version.
Otherwise, prefer using it internally and continue the workflow without showing the full spec text.
Do not answer a normal planning request by first printing the spec.

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
When the user asked for a WBS, do not stop after creating `project_draft_view`.
Import it and continue to workbook state internally before responding.
Do not pause this new-draft flow just to test a CLI entrypoint if the draft import can continue through the available runtime path.
Do not turn a normal new-draft request into a dependency diagnosis step unless the actual import path fails.

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
When the user asked to revise the existing plan, do not stop after generating `Patch JSON`.
Apply it internally before responding.

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
Do not use this operation as a default response to normal planning requests.
Use it only for explicit workbook inspection or real fallback handoff.

### Phase C report exports

Require a current project state before running any report export.
If the current state is `mikuproject_workbook_json`, rebuild a `ProjectModel` first.
Prefer the unified `report` entrypoints on `__mikuprojectCoreApi`.

Supported operations:

- `wbs-xlsx-export`: use `report.wbsXlsx.exportBytes()` for file export, or `report.wbsXlsx.exportWorkbook()` when workbook-level inspection is needed
- `daily-svg-export`: use `report.svg.exportDaily()`
- `weekly-svg-export`: use `report.svg.exportWeekly()`
- `monthly-calendar-svg-export`: use `report.svg.exportMonthlyCalendar()`
- `all-report-export`: use `report.all.export()`
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
