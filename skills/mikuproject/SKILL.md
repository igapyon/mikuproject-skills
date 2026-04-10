---
name: mikuproject
description: Use only when the user explicitly says `mikuproject`, `miku project`, or `mikuku project` for mikuproject-specific WBS workflows. This skill handles mikuproject draft, patch, workbook, and export operations; do not auto-activate it for generic planning or project discussion.
---

# Mikuproject

Use this skill for `mikuproject`-specific WBS drafting, revision, import, and export.
Keep the focus on WBS planning workflows and state conversion, not on replacing the browser UI.

For this skill, `mikuproject` should be opt-in by default.
Do not trigger `mikuproject` from planning words or export-format words alone.

Start `mikuproject` mode when at least one of these explicit triggers is present:

- the user names `mikuproject`
- the user writes `miku project`
- the user writes `mikuku project`
- the recent conversation is already in an active `mikuproject` workflow from an earlier explicit trigger

Without one of these triggers, do not force `mikuproject` just because the request mentions `WBS`, `スケジュール`, `工程`, `計画`, `Excel`, `xlsx`, `画像`, `SVG`, `Mermaid`, `ガント`, or similar words.
In that case, either answer normally or ask a brief clarifying question.

## Core Rules

- prefer agent-internal execution and keep intermediate JSON internal when possible
- complete import/apply steps internally instead of stopping at visible handoff
- for new WBS drafting, use `project_draft_view`
- for existing plan revision, use `Patch JSON`
- in `project_draft_view`, express dependencies on each task with `predecessor_uids` or `predecessors[].task_uid`; do not rely on top-level `dependencies`
- in `Patch JSON`, change dependencies with `link_tasks` / `unlink_tasks`; when generating lag, emit either `lag` or `lag_hours`, not both
- do not switch a normal `mikuproject` flow to ad-hoc tables, one-off converters, or runtime inspection unless the real path has failed

## Operations

Prefer the reusable upstream APIs exposed by the vendored `mikuproject`.
Use these before falling back to direct file reads or UI-oriented flows.

## Error Handling

Treat invalid document kind, missing base state for patch application, and missing required structure as hard errors.
Treat upstream warnings, partial imports, and export simplifications as soft errors.
On soft errors, continue and report warnings concisely.

## Boundaries

Do not overreach beyond the MVP.

- Do not pretend to replace `mikuproject` browser-side visual review
- Do not claim business validity of the WBS itself
- Do not confuse structural workbook `XLSX` with `WBS XLSX`
- Do not use an ambiguous `xlsx` filename when both structural workbook `XLSX` and report `WBS XLSX` are involved
- Do not prefer visible handoff output when hidden internal execution is available

## References

Read these only when needed:

- [references/INDEX.md](references/INDEX.md) for detailed workflow, I/O, runtime, and example references
