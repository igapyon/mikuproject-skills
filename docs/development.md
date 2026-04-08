# Development Notes

この文書は `mikuproject-skills` の開発者向けメモです。

## 文書の場所

- 実験参加者案内: [participant-invite-ja.md](./participant-invite-ja.md)
- 利用開始手順: [quickstart.md](./quickstart.md)
- 設計メモ: [agent-skill-design.md](./agent-skill-design.md)
- agent 内部連携メモ: [agent-to-agent-runner.md](./agent-to-agent-runner.md)
- skill 配置手順: [skill-installation.md](./skill-installation.md)
- upstream 調査: [upstream-survey.md](./upstream-survey.md)
- 次フェーズ案: [phase-b-primary-file-workflow.md](./phase-b-primary-file-workflow.md)
- Phase B 詳細: [phase-b-msproject-xml-workflow.md](./phase-b-msproject-xml-workflow.md)
- Phase B 詳細: [phase-b-workbook-json-workflow.md](./phase-b-workbook-json-workflow.md)
- Phase B 詳細: [phase-b-xlsx-workflow.md](./phase-b-xlsx-workflow.md)
- Phase C 詳細: [phase-c-wbs-xlsx-workflow.md](./phase-c-wbs-xlsx-workflow.md)
- Phase C 詳細: [phase-c-svg-workflow.md](./phase-c-svg-workflow.md)
- Phase C 詳細: [phase-c-markdown-mermaid-workflow.md](./phase-c-markdown-mermaid-workflow.md)
- upstream 総論メモ: [upstream-phase-c-report-api-proposal.md](./upstream-phase-c-report-api-proposal.md)
- upstream 相談メモ: [upstream-xlsx-api-proposal.md](./upstream-xlsx-api-proposal.md)
- upstream 相談メモ: [upstream-wbs-xlsx-api-proposal.md](./upstream-wbs-xlsx-api-proposal.md)
- upstream 相談メモ: [upstream-svg-api-proposal.md](./upstream-svg-api-proposal.md)
- upstream 相談メモ: [upstream-markdown-mermaid-api-proposal.md](./upstream-markdown-mermaid-api-proposal.md)
- 実装 TODO: [../TODO.md](../TODO.md)

## subtree 運用

`mikuproject` は `vendor/mikuproject/` に `git subtree` で取り込んでいます。

運用方針:

- `vendor/mikuproject/` は、できるだけ upstream をそのまま受信する場所として扱う
- このリポジトリ固有の都合で `vendor/mikuproject/` のソースを常用的に書き換えない
- skill 側や bundle 側の都合は、まず `skills/` や root 側の文書・補助コードで吸収する
- `subtree pull` で競合した場合は、原則として upstream 側を優先して解消する
- `vendor/mikuproject/` に local 修正を入れる場合は、次回同期で競合しやすくなることを理解したうえで、例外として扱う

## 生成物の配置方針

WBS 関連の生成物は、workspace ルートへ散らさず、`mikuproject/` 配下へ寄せる方針を推奨します。

推奨構成:

```text
mikuproject/
  state/
  report/
  tmp/
```

使い分け:

- `mikuproject/state/`: `mikuproject_workbook_json`、`project_draft_view`、`Patch JSON` などの状態ファイル
- `mikuproject/report/`: `WBS XLSX`、`daily/weekly/monthly SVG`、`WBS Markdown`、Mermaid などの成果物
- `mikuproject/tmp/`: 一時ファイル

ファイル名は `YYYYMMDDHHmm-` の時系列 prefix を推奨します。
同じ実行で出た複数成果物には、同一 prefix を使う前提で運用します。

例:

- `202604082215-workbook.json`
- `202604082215-wbs.xlsx`
- `202604082215-daily.svg`
- `202604082215-weekly.svg`
- `202604082215-patch.json`

取得:

```bash
git fetch https://github.com/igapyon/mikuproject.git devel
```

同期:

```bash
git subtree pull --prefix=vendor/mikuproject https://github.com/igapyon/mikuproject.git devel
```

## テスト

root で `vitest` を有効化しています。

```bash
npm install
npm test
```

現状の既定 test 対象:

- `tests/**/*.test.js`

upstream 側 test は必要時だけ明示的に実行します。

```bash
npm run test:upstream
```

ただし運用上は、`vendor/mikuproject/` 全体をこのリポジトリ側で常に検証対象にすることを主目的とはしません。

- このリポジトリで重視するのは、skill 側の動作確認と最低限の smoke test
- upstream `mikuproject` 自体の詳細な検証は、まず upstream 側で行われる前提とする
- `vendor/mikuproject/tests/**/*.test.js` を毎回必須で回すかどうかは、変更範囲に応じて判断する
- `vendor/mikuproject/` を単に同期しただけの場合は、upstream 全体テストをこのリポジトリで必須にしない

## 現在の MVP の前提

- skill は `skills/mikuproject` にある
- 会話境界の state は `mikuproject_workbook_json`
- upstream の stable API と unified core API を前提にしている
