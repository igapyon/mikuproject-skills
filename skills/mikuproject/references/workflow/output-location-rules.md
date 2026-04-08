# Output Location Rules

Use this reference when the skill writes user-facing artifacts.

## Default Directories

Unless the user explicitly requests another location, write generated files under the workspace-local `mikuproject/` tree.

- state-like artifacts -> `mikuproject/state/`
- final report exports -> `mikuproject/report/`
- temporary intermediate files -> `mikuproject/tmp/`

Standard mapping:

- `project_draft_view` -> `mikuproject/state/`
- `Patch JSON` -> `mikuproject/state/`
- `mikuproject_workbook_json` -> `mikuproject/state/`
- `WBS Markdown`, `Mermaid`, `WBS XLSX`, `daily SVG`, `weekly SVG`, monthly calendar ZIP -> `mikuproject/report/`
- ad-hoc scratch files -> `mikuproject/tmp/`

## Naming

- use `YYYYMMDDHHmm-<kind>.<ext>` by default
- reuse the same timestamp prefix when one request produces multiple related artifacts
- create target directories first when needed

## Required Defaults

- pass an explicit `--out` path when the CLI supports it
- prefer one upstream-generated archive such as `YYYYMMDDHHmm-report-bundle.zip` for all-report requests

## Forbidden Defaults

- workspace root outputs such as `./foo.svg` or `./bar.xlsx`
- user-facing artifacts under `skills/mikuproject/runtime/...`
- scattered root outputs with incremented suffixes
