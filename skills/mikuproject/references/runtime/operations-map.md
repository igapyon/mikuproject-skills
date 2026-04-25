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

The Java and Node.js runtime CLIs do not use the same argument shape.
The examples below intentionally list Java first, then the closest Node.js command when one exists.

| Operation | Java CLI example | Node.js CLI example | Notes |
| --- | --- | --- | --- |
| Version | `java -jar skills/mikuproject/runtime/mikuproject.jar --version` | `node skills/mikuproject/runtime/mikuproject.mjs --version` | Same purpose. |
| AI JSON spec | `java -jar skills/mikuproject/runtime/mikuproject.jar export-ai-json-spec` | `node skills/mikuproject/runtime/mikuproject.mjs ai spec` | Same purpose. |
| Draft import | `java -jar skills/mikuproject/runtime/mikuproject.jar import-ai-json draft.editjson output.xml` | `node skills/mikuproject/runtime/mikuproject.mjs state from-draft --in draft.editjson --out workbook.json` | Java writes XML. Node writes workbook JSON. Use Java `export-workbook-json output.xml` when workbook JSON is needed after Java import. |
| AI document kind detection | `java -jar skills/mikuproject/runtime/mikuproject.jar detect-ai-json-kind input.txt` | `node skills/mikuproject/runtime/mikuproject.mjs ai detect-kind --in document.json` | Similar purpose, different arguments. |
| Workbook JSON validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate-workbook-json input.json` | Not available as a direct Node.js command | Java-only direct validation command in the current CLI surface. |
| Workbook JSON replace import | `java -jar skills/mikuproject/runtime/mikuproject.jar import-workbook-json input.json output.xml` | Not available as a direct Node.js command | Java writes XML. Node generally treats workbook JSON as state input. |
| Workbook JSON merge import | `java -jar skills/mikuproject/runtime/mikuproject.jar merge-workbook-json base.xml input.json output.xml` | Not available as a direct Node.js command | Java-only direct merge command in the current CLI surface. |
| Workbook JSON export / normalize | `java -jar skills/mikuproject/runtime/mikuproject.jar export-workbook-json input.xml` | `node skills/mikuproject/runtime/mikuproject.mjs export workbook-json --in workbook.json --out workbook.normalized.json` | Java reads XML. Node reads workbook JSON. |
| Project overview view | `java -jar skills/mikuproject/runtime/mikuproject.jar export-project-overview-view input.xml` | `node skills/mikuproject/runtime/mikuproject.mjs ai export project-overview --in workbook.json --out overview.editjson` | Java reads XML. Node reads workbook JSON. |
| Task edit view | `java -jar skills/mikuproject/runtime/mikuproject.jar export-task-edit-view input.xml taskUid` | `node skills/mikuproject/runtime/mikuproject.mjs ai export task-edit --in workbook.json --task-uid taskUid --out task.editjson` | Java reads XML. Node reads workbook JSON. |
| Phase detail view | `java -jar skills/mikuproject/runtime/mikuproject.jar export-phase-detail-view input.xml phaseUid` | `node skills/mikuproject/runtime/mikuproject.mjs ai export phase-detail --in workbook.json --phase-uid phaseUid --out phase.editjson` | Java reads XML. Node reads workbook JSON. |
| Patch validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate-patch-json patch.editjson` | `node skills/mikuproject/runtime/mikuproject.mjs ai validate-patch --state workbook.json --in patch.editjson` | Java validates the patch document. Node validates against workbook state. |
| Patch apply | `java -jar skills/mikuproject/runtime/mikuproject.jar apply-patch-json base.xml patch.editjson output.xml` | `node skills/mikuproject/runtime/mikuproject.mjs state apply-patch --state workbook.json --in patch.editjson --out workbook.next.json` | Java uses XML state. Node uses workbook JSON state. |
| State summary | Not available as a direct Java command | `node skills/mikuproject/runtime/mikuproject.mjs state summarize --in workbook.json` | Node-only direct command in the current CLI surface. |
| State diff | Not available as a direct Java command | `node skills/mikuproject/runtime/mikuproject.mjs state diff --before workbook.before.json --after workbook.after.json` | Node-only direct command in the current CLI surface. |
| XML validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate-xml input.xml` | Not available as a direct Node.js command | Java-only direct validation command in the current CLI surface. |
| XML export | Indirect through Java XML-producing commands such as `import-ai-json`, `import-workbook-json`, `apply-patch-json`, or `merge-workbook-json` | `node skills/mikuproject/runtime/mikuproject.mjs export xml --in workbook.json --out project.xml` | Node directly exports XML from workbook JSON. Java commands commonly use XML as input/output. |
| Structural XLSX export | `java -jar skills/mikuproject/runtime/mikuproject.jar export-xlsx input.xml output.xlsxbin` | `node skills/mikuproject/runtime/mikuproject.mjs export xlsx --in workbook.json --out project.xlsx` | Java reads XML. Node reads workbook JSON. |
| Structural XLSX validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate-xlsx input.xlsxbin` | Not available as a direct Node.js command | Java-only direct validation command in the current CLI surface. |
| Structural XLSX replace import | `java -jar skills/mikuproject/runtime/mikuproject.jar import-xlsx input.xlsxbin output.xml` | Not available as a direct Node.js command | Java-only direct import command in the current CLI surface. |
| Structural XLSX merge import | `java -jar skills/mikuproject/runtime/mikuproject.jar merge-xlsx base.xml input.xlsxbin output.xml` | Not available as a direct Node.js command | Java-only direct merge command in the current CLI surface. |
| Report bundle | `java -jar skills/mikuproject/runtime/mikuproject.jar export-report-bundle input.xml output.zip` | `node skills/mikuproject/runtime/mikuproject.mjs report all --in workbook.json --out report-bundle.zip` | Java reads XML. Node reads workbook JSON. |
| Report directory | `java -jar skills/mikuproject/runtime/mikuproject.jar export-report-dir input.xml output.dir` | Not available as a direct Node.js command | Java-only direct directory export command in the current CLI surface. |
| WBS XLSX report | `java -jar skills/mikuproject/runtime/mikuproject.jar export-wbs-xlsx input.xml output.xlsxbin` | `node skills/mikuproject/runtime/mikuproject.mjs report wbs-xlsx --in workbook.json --out report.xlsx` | Java reads XML. Node reads workbook JSON. |
| Daily SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar export-daily-svg input.xml` | `node skills/mikuproject/runtime/mikuproject.mjs report daily-svg --in workbook.json --out report.svg` | Java reads XML. Node reads workbook JSON. |
| Weekly SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar export-weekly-svg input.xml` | `node skills/mikuproject/runtime/mikuproject.mjs report weekly-svg --in workbook.json --out report.svg` | Java reads XML. Node reads workbook JSON. |
| Monthly SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar export-monthly-svg-zip input.xml output.zip` | `node skills/mikuproject/runtime/mikuproject.mjs report monthly-calendar-svg --in workbook.json --out report.zip` | Java reads XML. Node reads workbook JSON. |
| WBS Markdown report | `java -jar skills/mikuproject/runtime/mikuproject.jar export-wbs-markdown input.xml` | `node skills/mikuproject/runtime/mikuproject.mjs report wbs-markdown --in workbook.json --out report.md` | Java reads XML. Node reads workbook JSON. |
| Mermaid report | `java -jar skills/mikuproject/runtime/mikuproject.jar export-mermaid input.xml` | `node skills/mikuproject/runtime/mikuproject.mjs report mermaid --in workbook.json --out report.mmd` | Java reads XML. Node reads workbook JSON. |

Batch commands such as `*-batch` exist on the Java runtime for several operations.
The Node.js runtime examples above are single-operation commands.

## TOBE Java Facade CLI Proposal

This section is a proposal for a future `mikuproject-java` facade CLI.
It is not the current Java CLI contract.

The goal is to keep Java as the first example shown to agents while reducing confusion from
the current XML-first positional-argument commands.
The proposed facade should use the same operation grouping style as the Node.js runtime:

- `ai ...` for AI-facing specs and projections
- `state ...` for workbook JSON state operations
- `export ...` for exchange-format exports
- `report ...` for presentation/report outputs
- `--in`, `--out`, `--state`, `--before`, and `--after` for named file arguments
- `.xlsx` for visible XLSX files, not `output.xlsxbin`

Proposed Java facade examples:

| Operation | TOBE Java facade example | Notes |
| --- | --- | --- |
| Version | `java -jar skills/mikuproject/runtime/mikuproject.jar --version` | Keep the existing simple version shape. |
| AI JSON spec | `java -jar skills/mikuproject/runtime/mikuproject.jar ai spec` | Mirrors Node.js `ai spec`. |
| Draft import | `java -jar skills/mikuproject/runtime/mikuproject.jar state from-draft --in draft.editjson --out workbook.json` | Reads `project_draft_view`, writes workbook JSON directly. |
| AI document kind detection | `java -jar skills/mikuproject/runtime/mikuproject.jar ai detect-kind --in document.json` | Uses the same grouped naming as Node.js. |
| Workbook JSON validation | `java -jar skills/mikuproject/runtime/mikuproject.jar state validate --in workbook.json` | Keeps validation under `state`. |
| Workbook JSON replace import | `java -jar skills/mikuproject/runtime/mikuproject.jar state import --in workbook.json --out workbook.normalized.json` | Normalizes or accepts workbook JSON without exposing XML. |
| Workbook JSON merge import | `java -jar skills/mikuproject/runtime/mikuproject.jar state merge --state workbook.json --in workbook.patch.json --out workbook.next.json` | Uses workbook JSON as the visible state boundary. |
| Workbook JSON export / normalize | `java -jar skills/mikuproject/runtime/mikuproject.jar export workbook-json --in workbook.json --out workbook.normalized.json` | Mirrors Node.js `export workbook-json`. |
| Project overview view | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export project-overview --in workbook.json --out overview.editjson` | Reads workbook JSON, writes projection JSON. |
| Task edit view | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export task-edit --in workbook.json --task-uid taskUid --out task.editjson` | Uses a named task UID option. |
| Phase detail view | `java -jar skills/mikuproject/runtime/mikuproject.jar ai export phase-detail --in workbook.json --phase-uid phaseUid --out phase.editjson` | Uses named phase and output options. |
| Patch validation | `java -jar skills/mikuproject/runtime/mikuproject.jar ai validate-patch --state workbook.json --in patch.editjson` | Validates against the visible workbook JSON state. |
| Patch apply | `java -jar skills/mikuproject/runtime/mikuproject.jar state apply-patch --state workbook.json --in patch.editjson --out workbook.next.json` | Reads and writes workbook JSON directly. |
| State summary | `java -jar skills/mikuproject/runtime/mikuproject.jar state summarize --in workbook.json` | Adds Java parity for the Node.js state summary command. |
| State diff | `java -jar skills/mikuproject/runtime/mikuproject.jar state diff --before workbook.before.json --after workbook.after.json` | Adds Java parity for the Node.js state diff command. |
| XML validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate xml --in project.xml` | Uses named input while keeping XML validation explicit. |
| XML export | `java -jar skills/mikuproject/runtime/mikuproject.jar export xml --in workbook.json --out project.xml` | Exports XML from workbook JSON without exposing intermediate XML-only workflows. |
| Structural XLSX export | `java -jar skills/mikuproject/runtime/mikuproject.jar export xlsx --in workbook.json --out workbook.xlsx` | Uses `.xlsx`, not `.xlsxbin`, in the facade. |
| Structural XLSX validation | `java -jar skills/mikuproject/runtime/mikuproject.jar validate xlsx --in workbook.xlsx` | Uses visible `.xlsx` naming. |
| Structural XLSX replace import | `java -jar skills/mikuproject/runtime/mikuproject.jar import xlsx --in workbook.xlsx --out workbook.json` | Imports `.xlsx` to workbook JSON directly. |
| Structural XLSX merge import | `java -jar skills/mikuproject/runtime/mikuproject.jar merge xlsx --state workbook.json --in workbook.xlsx --out workbook.next.json` | Merges visible `.xlsx` edits into workbook JSON state. |
| Report bundle | `java -jar skills/mikuproject/runtime/mikuproject.jar report all --in workbook.json --out report-bundle.zip` | Mirrors Node.js `report all`. |
| Report directory | `java -jar skills/mikuproject/runtime/mikuproject.jar report dir --in workbook.json --out report.dir` | Java-specific convenience can remain, but uses named args. |
| WBS XLSX report | `java -jar skills/mikuproject/runtime/mikuproject.jar report wbs-xlsx --in workbook.json --out wbs.xlsx` | Uses `.xlsx` for visible report output. |
| Daily SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar report daily-svg --in workbook.json --out daily.svg` | Mirrors Node.js report grouping. |
| Weekly SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar report weekly-svg --in workbook.json --out weekly.svg` | Mirrors Node.js report grouping. |
| Monthly SVG report | `java -jar skills/mikuproject/runtime/mikuproject.jar report monthly-calendar-svg --in workbook.json --out monthly-calendar.zip` | Uses a descriptive ZIP output name. |
| WBS Markdown report | `java -jar skills/mikuproject/runtime/mikuproject.jar report wbs-markdown --in workbook.json --out wbs.md` | Mirrors Node.js report grouping. |
| Mermaid report | `java -jar skills/mikuproject/runtime/mikuproject.jar report mermaid --in workbook.json --out mermaid.mmd` | Mirrors Node.js report grouping. |

Guidance for implementing the facade in `mikuproject-java`:

- Keep the existing Java CLI commands for compatibility.
- Treat the facade as an agent-facing and user-facing layer over the existing Java implementation.
- Prefer workbook JSON as the visible state boundary for `state`, `ai`, `export`, and `report` facade commands.
- Hide XML intermediates unless the command is explicitly about XML.
- Hide implementation-specific binary naming such as `xlsxbin` from facade examples and outputs.
- Keep option names close to the Node.js runtime where the behavior is equivalent.
