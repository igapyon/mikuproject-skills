# Backend Switching Manual Test

この文書は、`mikuproject-skills` の CLI backend / MCP backend 切り替えを手動確認するための手順です。

ここでは自動テストではなく、MCP server を起動して MCP client から呼び出す確認を中心にします。

## 位置づけ

- `mikuproject-skills` は Agent Skill workflow layer
- CLI backend は `skills/mikuproject/runtime/` の bundled runtime artifact
- MCP backend は `mikuproject-mcp`
- 参照 checkout は `workplace/mikuproject-mcp-devel`
- release tarball 版は GitHub Releases の配布 artifact

`mikuproject-skills` は MCP server 実装を内包しません。

## 1. local checkout 版 MCP server を build する

local checkout 版は、`mikuproject-mcp` 側の未リリース変更や手元の開発変更を確認する場合に使います。

```bash
npm --prefix workplace/mikuproject-mcp-devel install
npm --prefix workplace/mikuproject-mcp-devel run build
```

build 後の stdio entrypoint:

```text
workplace/mikuproject-mcp-devel/packages/node/dist/index.js
```

## 2. local checkout 版 MCP server を手動起動する

MCP server は local stdio server です。
単独で起動すると、標準入出力で MCP client からの通信を待ちます。

```bash
cd workplace/mikuproject-mcp-devel
node packages/node/dist/index.js
```

通常は terminal で直接操作するのではなく、MCP client 設定から起動します。

MCP client 設定例:

```json
{
  "mcpServers": {
    "mikuproject": {
      "command": "node",
      "args": ["packages/node/dist/index.js"],
      "cwd": "workplace/mikuproject-mcp-devel"
    }
  }
}
```

client が `cwd` をサポートしない場合は、client 環境から見える path を指定してください。
この repo の文書には machine-local な絶対 path を固定しません。

## 3. release tarball 版 MCP server を手動起動する

release tarball 版は、公開済みの `mikuproject-mcp` server で backend switching を確認する場合に使います。
`mikuproject-mcp` 側の local checkout を使わないため、手元の未リリース変更は反映されません。

対象 release:

```text
https://github.com/igapyon/mikuproject-mcp/releases/tag/v0.1.0
```

tarball:

```text
https://github.com/igapyon/mikuproject-mcp/releases/download/v0.1.0/igapyon-mikuproject-mcp-node-0.1.0.tgz
```

手動起動例:

```bash
npm exec --yes --package=https://github.com/igapyon/mikuproject-mcp/releases/download/v0.1.0/igapyon-mikuproject-mcp-node-0.1.0.tgz -- mikuproject-mcp
```

MCP client 設定例:

```json
{
  "mcpServers": {
    "mikuproject": {
      "command": "npm",
      "args": [
        "exec",
        "--yes",
        "--package=https://github.com/igapyon/mikuproject-mcp/releases/download/v0.1.0/igapyon-mikuproject-mcp-node-0.1.0.tgz",
        "--",
        "mikuproject-mcp"
      ]
    }
  }
}
```

release tarball 版での確認では、MCP server の version と tool list が対象 release 由来であることを確認します。
local checkout 版と混在させないため、同じ client 設定で両方を同時に有効化しません。

## 4. MCP backend の手動確認

MCP client から次を確認します。

### Tool list

少なくとも次の tool が見えることを確認します。

- `mikuproject.ai_spec`
- `mikuproject.state_from_draft`
- `mikuproject.export_workbook_json`
- `mikuproject.report_wbs_markdown`
- `mikuproject.report_mermaid`

### `spec`

MCP tool:

```text
mikuproject.ai_spec
```

期待:

- AI JSON spec が返る
- operation result が error ではない

CLI backend の対応:

```bash
java -jar skills/mikuproject/runtime/mikuproject.jar ai spec
node skills/mikuproject/runtime/mikuproject.mjs ai spec
```

### `draft`

MCP tool:

```text
mikuproject.state_from_draft
```

期待:

- `project_draft_view` から workbook state が生成される
- result に generated artifact / operation summary が含まれる

CLI backend の対応:

```bash
java -jar skills/mikuproject/runtime/mikuproject.jar state from-draft --in draft.editjson --out workbook.json
node skills/mikuproject/runtime/mikuproject.mjs state from-draft --in draft.editjson --out workbook.json
```

### `wbs-markdown-export`

MCP tool:

```text
mikuproject.report_wbs_markdown
```

期待:

- workbook state から WBS Markdown report が生成される
- report artifact または report resource が確認できる

CLI backend の対応:

```bash
java -jar skills/mikuproject/runtime/mikuproject.jar report wbs-markdown --in workbook.json --out wbs.md
node skills/mikuproject/runtime/mikuproject.mjs report wbs-markdown --in workbook.json --out wbs.md
```

## 5. backend policy ごとの手動確認

### `mcp-only`

確認したいこと:

- MCP backend だけを使う
- CLI runtime artifact を fallback として探さない
- MCP tool がない operation は hard execution-path error として扱う

手動確認例:

- `mikuproject.ai_spec` は実行できる
- `mikuproject.report_wbs_markdown` は実行できる
- `wbs-xlsx-export` は現行 MCP backend tool がないため、`mcp-only` では CLI に fallback しない

### `cli-only`

確認したいこと:

- CLI backend だけを使う
- MCP tool を fallback として呼ばない

手動確認例:

```bash
java -jar skills/mikuproject/runtime/mikuproject.jar ai spec
node skills/mikuproject/runtime/mikuproject.mjs ai spec
```

MCP server が起動していても、`cli-only` の確認では MCP tool を呼ばない。

### `cli-preferred`

確認したいこと:

- CLI backend を先に使う
- CLI が unavailable / unsuitable の場合だけ、許可されていれば MCP backend を使う
- fallback した場合は source backend、target backend、理由を記録する

手動確認では、まず CLI で同じ operation が通ることを確認し、次に MCP tool でも同等 operation が通ることを確認します。

### `mcp-preferred`

確認したいこと:

- MCP backend を先に使う
- MCP が unavailable / unsuitable の場合だけ、許可されていれば CLI backend を使う
- fallback した場合は source backend、target backend、理由を記録する

手動確認では、まず MCP tool が通ることを確認し、同じ operation の CLI command も fallback 候補として通ることを確認します。

### `handoff-only`

確認したいこと:

- CLI command を実行しない
- MCP tool を呼ばない
- spec / JSON / 手順を visible handoff として返す

## 6. 現行 MCP backend の注意

現行 MCP backend はすべての CLI operation を公開しているわけではありません。

MCP backend で利用できる代表例:

- `mikuproject.ai_spec`
- `mikuproject.state_from_draft`
- `mikuproject.export_workbook_json`
- `mikuproject.report_wbs_markdown`
- `mikuproject.report_mermaid`

MCP backend 未対応として扱う代表例:

- `wbs-xlsx-export`
- `daily-svg-export`
- `weekly-svg-export`
- `monthly-calendar-svg-export`
- `all-report-export`

strict policy の `mcp-only` では、未対応 operation を CLI に自動 fallback しません。

## 7. 手動確認の完了条件

- MCP client から `mikuproject` server が見える
- local checkout 版または release tarball 版のどちらで確認したかを記録している
- MCP tool list に product-prefixed tool が見える
- `mikuproject.ai_spec` が通る
- `mikuproject.state_from_draft` が通る
- `mikuproject.report_wbs_markdown` が通る
- 対応する CLI command も通る
- `mcp-only` では MCP 未対応 operation が CLI fallback されないことを確認できる
- `cli-only` では MCP server が起動していても MCP tool を呼ばない運用で確認できる
