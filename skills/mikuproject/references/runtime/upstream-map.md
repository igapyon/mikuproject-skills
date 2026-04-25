# Upstream Runtime Map

Use this reference when you need the exact `mikuproject` runtime locations behind the MVP workflow.

## Preferred Runtime Search Order

Check these skill-local runtime artifacts before broad repository exploration:

- `skills/mikuproject/runtime/mikuproject.jar`
- `skills/mikuproject/runtime/mikuproject.mjs`

When both are present, prefer the Java runtime for operations it supports. Use the Node.js runtime when the Java runtime is missing or does not support the requested operation.

## Stable Runtime Entry Points

Java runtime:

```bash
java -jar skills/mikuproject/runtime/mikuproject.jar export-ai-json-spec
java -jar skills/mikuproject/runtime/mikuproject.jar import-ai-json input.editjson output.xml
java -jar skills/mikuproject/runtime/mikuproject.jar export-report-bundle input.xml output.zip
```

Node.js runtime:

```bash
node skills/mikuproject/runtime/mikuproject.mjs ai spec
node skills/mikuproject/runtime/mikuproject.mjs state from-draft --in draft.editjson --out workbook.json
node skills/mikuproject/runtime/mikuproject.mjs state apply-patch --state workbook.json --in patch.editjson --out workbook.next.json
node skills/mikuproject/runtime/mikuproject.mjs report all --in workbook.json --out report-bundle.zip
```

## Main Formats

- `MS Project XML`
  - Java CLI: XML-first commands such as `validate-xml`, `export-workbook-json`, and report exports
  - Node CLI: workbook-state commands such as `export xml`
- workbook `XLSX`
  - Java CLI: `export-xlsx`, `import-xlsx`, `merge-xlsx`
  - Node CLI: `export xlsx`
- `project_draft_view`
  - Java CLI: `import-ai-json`
  - Node CLI: `state from-draft`
- `Patch JSON`
  - Java CLI: `apply-patch-json`
  - Node CLI: `ai validate-patch` and `state apply-patch`
- `mikuproject_workbook_json`
  - Java CLI: `export-workbook-json`, `import-workbook-json`, `merge-workbook-json`
  - Node CLI: `export workbook-json`, `state summarize`, `state diff`

## Working Assumption

For the MVP, prefer `mikuproject_workbook_json` at the conversation boundary.
Use runtime CLI commands rather than reading upstream source files directly.
