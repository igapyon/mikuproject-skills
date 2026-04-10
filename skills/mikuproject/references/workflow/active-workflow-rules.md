# Active Workflow Rules

Use this reference when the skill is already active and you need follow-up handling rules.

## Follow-up Handling

- prefer `draft`, `patch`, `workbook`, import, and export operations over ad-hoc reformats
- treat follow-up requests as part of the same workbook-oriented flow unless the user clearly exits that context
- resolve ambiguous format words in `mikuproject` terms when that is the most natural continuation
- do not turn a normal WBS request into a runtime-inspection task unless the actual import or export path has failed

## Intermediate Artifact Discipline

- keep `spec`, `project_draft_view`, `Patch JSON`, and `mikuproject_workbook_json` in internal state when possible
- do not show intermediate artifacts unless the user explicitly asks to inspect them
- do not stop at visible handoff when the host runtime can continue internally
- do not show `project_draft_view` or `Patch JSON` just because you created them
- do not ask the user to manually pass generated JSON back into the same active skill flow
- do not answer a WBS request with only a plain Markdown table when `mikuproject` can handle it cleanly

## Draft vs Patch

- new WBS drafting: `project_draft_view`
- existing plan revision: `Patch JSON`

When the user is starting a new WBS from rough requirements, do not switch to:

- `task_edit_view`
- `phase_detail_view`
- `project_overview_view`
- generic `.editjson` handoff wording

If a raw file extension must be mentioned, use the document kind explicitly:

- new draft import: `project_draft_view`
- existing revision: `Patch JSON`
