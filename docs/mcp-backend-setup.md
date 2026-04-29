# MCP Backend Setup

この文書は、`mikuproject-skills` から MCP backend を使うための最小設定メモです。

`mikuproject-skills` は MCP server 本体を標準同梱しません。
MCP backend を使う場合は、別配布の `mikuproject-mcp` を MCP client から起動します。

## 位置づけ

- `mikuproject-skills`: Agent Skill の workflow layer
- `mikuproject-mcp`: MCP server adapter
- `mikuproject-mcp` の server key は、MCP client 設定では短く `mikuproject` として構いません
- MCP tool 名は `mikuproject_ai_spec` のような `mikuproject_*` 形式です

`mikuproject-skills` 側の既定 backend policy は `cli-preferred` です。
MCP backend を明示したい場合は、会話で `mcp-only` または `mcp-preferred` を指定します。

例:

```text
mikuproject、mcp-only で AI spec を確認して
```

## VS Code 設定例

VS Code で使う場合は、workspace の `.vscode/mcp.json` に MCP server 設定を置きます。

例:

```json
{
  "servers": {
    "mikuproject": {
      "type": "stdio",
      "command": "npm",
      "args": [
        "exec",
        "--yes",
        "--package=${workspaceFolder}/workplace/igapyon-mikuproject-mcp-node-0.8.2.tgz",
        "--",
        "mikuproject-mcp"
      ],
      "env": {
        "MIKUPROJECT_MCP_WORKSPACE": "${workspaceFolder}/workplace/mikuproject-mcp-vscode"
      }
    }
  }
}
```

この例では、MCP server package を次に置いている前提です。

```text
workplace/igapyon-mikuproject-mcp-node-0.8.2.tgz
```

生成物は次の下に出ます。

```text
workplace/mikuproject-mcp-vscode
```

`.vscode/mcp.json` と `workplace/` はローカル環境用として扱います。

## 最小確認

MCP server を起動できたら、まず `mikuproject_ai_spec` を呼び出します。

期待:

- `operation` が `mikuproject_ai_spec`
- hard error ではない
- `mikuproject://spec/ai-json` または AI spec 本文を参照できる

次に tool list で `mikuproject_report_wbs_xlsx` などの report tools が見えることを確認します。
見えない場合は、古い `mikuproject-mcp` package が起動している可能性があります。

## 詳細確認

tool list、prompt list、draft からの workbook state 作成、report 生成まで確認する場合は、
[backend-switching-manual-test.md](./backend-switching-manual-test.md) を使います。

この文書は利用者向けの最小設定メモであり、
`backend-switching-manual-test.md` は開発者・検証者向けの手動テスト手順です。
