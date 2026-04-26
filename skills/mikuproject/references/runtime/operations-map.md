# Operations Map

Use this reference when you need the supported operation list or the preferred upstream runtime surface.

## Operations

Conversation workflow:

- `spec`: provide `mikuproject-ai-json-spec`
- `draft`: accept AI-produced `project_draft_view`
- `patch`: accept AI-produced `Patch JSON`
- `workbook`: return current `mikuproject_workbook_json`
- `project-overview`: return `project_overview_view` for existing-plan entry
- `task-edit`: return `task_edit_view` for local task revision
- `phase-detail`: return `phase_detail_view` for local phase revision
- `patch-validate`: validate `patch_json` against current workbook state
- `state-diff`: summarize changes between two workbook states

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

When this skill is installed from `skill-bundle`, prefer the bundled runtime artifacts:

- `skills/mikuproject/runtime/mikuproject.jar`
- `skills/mikuproject/runtime/mikuproject.mjs`

When working in the development repository, use the same skill-local runtime paths:

- `skills/mikuproject/runtime/mikuproject.jar`
- `skills/mikuproject/runtime/mikuproject.mjs`

Do not search broadly for alternate copies before checking these expected locations.

## Preferred Runtime Surface

List Java examples before Node.js examples so agents see the Java runtime first.
Use the runtime that supports the requested operation:

- `java -jar skills/mikuproject/runtime/mikuproject.jar ...`
- `node skills/mikuproject/runtime/mikuproject.mjs ...`

Use the upstream CLI runtime artifacts before falling back to direct file reads or UI-oriented flows.

## Java / Node.js CLI Correspondence

The Java and Node.js runtime CLIs now use the same grouped command shape for
the main agent-facing workflows. The examples below intentionally list Java
first, then the closest Node.js command when one exists.

| Operation | Java CLI example | Node.js CLI example | Notes |
| --- | --- | --- | --- |
| Version | `java -jar skills/mikuproject/runtime/mikuproject.jar --version` | `node skills/mikuproject/runtime/mikuproject.mjs --version` | Same purpose. |
| AI JSON spec | `java -jar skills/mikuproject/runtime/mikuproject.jar ai spec` | `node skills/mikuproject/runtime/mikuproject.mjs ai spec` | Same purpose. |
| Draft import | `java -jar skills/mikuproject/runtime/mikuproject.jar state from-draft --in draft.editjson --out workbook.json` | `node skills/mikuproject/runtime/mikuproject.mjs state from-draft --in draft.editjson --out workbook.json` | Same purpose. |
| AI document kind detection | `java -jar skills/mikuproject/runtime/mikuproject.jar ai detect-kind --in document.json` | `node skills/mikuproject/runtime/mikuproject.mjs ai detect-kind --in document.json` | Same purpose. |
| Workbook JSON validation | `java -jar skills/mikuproject/runtime/mikuproject.jar state validate --in workbook.json` | Not available as a direct Node.js command | Java validates workbook JSON directly. |
| Workbook JSON replace import | `java -jar skills/mikuproject/runtime/mikuproject.jar state import --in workbook.json --out workbook.normalized.json` | Not available as a direct Node.js command | Java normalizes workbook JSON directly. |
| Workbook JSON merge import | `java -jar skills/mikuproject/runtime/mikuproject.jar state merge --state workbook.json --in workbook.patch.json --out workbook.next.json` | Not available as a direct Node.js command | Java merges workbook JSON directly. |
| Workbook JSON export / normalize | `java -jar skills/mikuproject/runtime/mikuproject.jar export workbook-json --in workbook.json --out workbook.normalized.json` | `node skills/mikuproject/runtime/mikuproject.mjs export workbook-json --in workbook.json --out workbook.normalized.json` | Same purpose. |
| Project overview view | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export project-overview --in workbook.json --out overview.editjson` | `node skills/mikuproject/runtime/mikuproject.mjs ai export project-overview --in workbook.json --out overview.editjson` | Same purpose. |
| AI projection bundle | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export bundle --in workbook.json --out bundle.editjson` | `node skills/mikuproject/runtime/mikuproject.mjs ai export bundle --in workbook.json --out bundle.editjson` | Same purpose. |
| Task edit view | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export task-edit --in workbook.json --task-uid taskUid --out task.editjson` | `node skills/mikuproject/runtime/mikuproject.mjs ai export task-edit --in workbook.json --task-uid taskUid --out task.editjson` | Same purpose. |
| Phase detail view | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export phase-detail --in workbook.json --phase-uid phaseUid --out phase.editjson` | `node skills/mikuproject/runtime/mikuproject.mjs ai export phase-detail --in workbook.json --phase-uid phaseUid --out phase.editjson` | Same purpose. |
| Patch validation | `java -jar skills/mikuproject/runtime/mikuproject.jar ai validate-patch --state workbook.json --in patch.editjson` | `node skills/mikuproject/runtime/mikuproject.mjs ai validate-patch --state workbook.json --in patch.editjson` | Same purpose. |
| Patch apply | `java -jar skills/mikuproject/runtime/mikuproject.jar state apply-patch --state workbook.json --in patch.editjson --out workbook.next.json` | `node skills/mikuproject/runtime/mikuproject.mjs state apply-patch --state workbook.json --in patch.editjson --out workbook.next.json` | Same purpose. |
| State summary | `java -jar skills/mikuproject/runtime/mikuproject.jar state summarize --in workbook.json` | `node skills/mikuproject/runtime/mikuproject.mjs state summarize --in workbook.json` | Same purpose. |
| State diff | `java -jar skills/mikuproject/runtime/mikuproject.jar state diff --before workbook.before.json --after workbook.after.json` | `node skills/mikuproject/runtime/mikuproject.mjs state diff --before workbook.before.json --after workbook.after.json` | Same purpose. |
| XML validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate xml --in project.xml` | Not available as a direct Node.js command | Java validates XML directly. |
| XML export | `java -jar skills/mikuproject/runtime/mikuproject.jar export xml --in workbook.json --out project.xml` | `node skills/mikuproject/runtime/mikuproject.mjs export xml --in workbook.json --out project.xml` | Same purpose. |
| Structural XLSX export | `java -jar skills/mikuproject/runtime/mikuproject.jar export xlsx --in workbook.json --out workbook.xlsx` | `node skills/mikuproject/runtime/mikuproject.mjs export xlsx --in workbook.json --out workbook.xlsx` | Same purpose. |
| Structural XLSX validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate xlsx --in workbook.xlsx` | Not available as a direct Node.js command | Java validates workbook XLSX directly. |
| Structural XLSX replace import | `java -jar skills/mikuproject/runtime/mikuproject.jar import xlsx --in workbook.xlsx --out workbook.json` | Not available as a direct Node.js command | Java imports XLSX directly. |
| Structural XLSX merge import | `java -jar skills/mikuproject/runtime/mikuproject.jar merge xlsx --state workbook.json --in workbook.xlsx --out workbook.next.json` | Not available as a direct Node.js command | Java merges XLSX edits directly. |
| Report bundle | `java -jar skills/mikuproject/runtime/mikuproject.jar report all --in workbook.json --out report-bundle.zip` | `node skills/mikuproject/runtime/mikuproject.mjs report all --in workbook.json --out report-bundle.zip` | Same purpose. |
| Report directory | `java -jar skills/mikuproject/runtime/mikuproject.jar report dir --in workbook.json --out report.dir` | Not available as a direct Node.js command | Java can write an unpacked report directory. |
| WBS XLSX report | `java -jar skills/mikuproject/runtime/mikuproject.jar report wbs-xlsx --in workbook.json --out wbs.xlsx` | `node skills/mikuproject/runtime/mikuproject.mjs report wbs-xlsx --in workbook.json --out wbs.xlsx` | Same purpose. |
| Daily SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar report daily-svg --in workbook.json --out daily.svg` | `node skills/mikuproject/runtime/mikuproject.mjs report daily-svg --in workbook.json --out daily.svg` | Same purpose. |
| Weekly SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar report weekly-svg --in workbook.json --out weekly.svg` | `node skills/mikuproject/runtime/mikuproject.mjs report weekly-svg --in workbook.json --out weekly.svg` | Same purpose. |
| Monthly SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar report monthly-calendar-svg --in workbook.json --out monthly-calendar.zip` | `node skills/mikuproject/runtime/mikuproject.mjs report monthly-calendar-svg --in workbook.json --out monthly-calendar.zip` | Same purpose. |
| WBS Markdown report | `java -jar skills/mikuproject/runtime/mikuproject.jar report wbs-markdown --in workbook.json --out wbs.md` | `node skills/mikuproject/runtime/mikuproject.mjs report wbs-markdown --in workbook.json --out wbs.md` | Same purpose. |
| Mermaid report | `java -jar skills/mikuproject/runtime/mikuproject.jar report mermaid --in workbook.json --out mermaid.mmd` | `node skills/mikuproject/runtime/mikuproject.mjs report mermaid --in workbook.json --out mermaid.mmd` | Same purpose. |

Use `.xlsx` for visible XLSX files. Do not expose implementation-specific names
such as `xlsxbin` in examples or outputs.
