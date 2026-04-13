# Operations Map

Use this reference when you need the supported operation list or the preferred upstream API surface.

## Operations

Conversation workflow:

- `spec`: provide `mikuproject-ai-json-spec`
- `draft`: accept AI-produced `project_draft_view`
- `patch`: accept AI-produced `Patch JSON`
- `workbook`: return current `mikuproject_workbook_json`

File workflow:

- `xml-import`: accept `MS Project XML` and return `mikuproject_workbook_json`
- `xml-export`: return current `MS Project XML`
- `xlsx-import`: accept structural workbook `XLSX` and return `mikuproject_workbook_json`
- `xlsx-merge-import`: apply structural workbook `XLSX` edits onto an existing state
- `xlsx-export`: return current structural workbook `XLSX`
- `workbook-import`: accept `mikuproject_workbook_json` as a replace import
- `workbook-merge-import`: apply `mikuproject_workbook_json` onto an existing state
- `workbook-export`: return current `mikuproject_workbook_json` as a file-oriented export

Report workflow:

- `wbs-xlsx-export`: return current `WBS XLSX`
- `daily-svg-export`: return current daily `SVG`
- `weekly-svg-export`: return current weekly `SVG`
- `monthly-calendar-svg-export`: return current monthly calendar `SVG` entries
- `all-report-export`: return current report bundle `ZIP`
- `wbs-markdown-export`: return current `WBS Markdown`
- `mermaid-export`: return current Mermaid gantt text

## Runtime Search Order

When this skill is installed from `skill-bundle`, prefer:

- `skills/mikuproject/vendor/mikuproject`

When working in the development repository, use:

- `vendor/mikuproject`

Do not search broadly for alternate copies before checking these expected locations.

## Preferred API Surface

Prefer:

- `globalThis.__mikuprojectAiJsonSpec`
- `globalThis.__mikuprojectCoreApi`

Use the reusable upstream APIs before falling back to direct file reads or UI-oriented flows.
