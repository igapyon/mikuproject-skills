# Development Notes

この文書は `mikuproject-skills` の開発者向けメモです。

## 文書の場所

- 利用開始手順: [quickstart.md](./quickstart.md)
- 設計メモ: [agent-skill-design.md](./agent-skill-design.md)
- agent 内部連携メモ: [agent-to-agent-runner.md](./agent-to-agent-runner.md)
- skill 配置手順: [skill-installation.md](./skill-installation.md)
- ファイル入出力: [file-import-export.md](./file-import-export.md)
- レポート出力: [report-export.md](./report-export.md)
- 実装 TODO: [../TODO.md](../TODO.md)

## upstream runtime artifact 運用

`mikuproject-skills` は、通常の skill 実行時に upstream source tree を直接使わず、
`skills/mikuproject/runtime/` に置いた runtime artifact を使います。

現在の必須 runtime artifact:

- `skills/mikuproject/runtime/mikuproject.jar`
- `skills/mikuproject/runtime/mikuproject.mjs`

更新時は upstream 側で artifact を生成して、この 2 ファイルを差し替えます。
upstream source tree をこのリポジトリに同期する運用は通常不要です。

このリポジトリで一時的に upstream を取得して artifact を更新する場合は、
repo 直下の `workplace/` を使います。`workplace/` はローカル作業用であり、
通常の内容は Git 管理しません。

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

推奨更新手順:

```bash
npm run update:runtime
```

このコマンドは次を行います。

- `workplace/upstream/mikuproject` に `mikuproject` を clone または更新する
- `workplace/upstream/mikuproject-java` に `mikuproject-java` を clone または更新する
- Node.js 側で `bundle/mikuproject.mjs` を生成する
- Java 側で `target/mikuproject.jar` を生成する
- 生成物を `skills/mikuproject/runtime/` にコピーする
- コピー後の `mikuproject.jar` と `mikuproject.mjs` を smoke test する

既定の取得元と ref:

- `mikuproject`: `https://github.com/igapyon/mikuproject.git` の `devel`
- `mikuproject-java`: `https://github.com/igapyon/mikuproject-java.git` の `devel`

必要に応じて環境変数で変更できます。

```bash
MIKUPROJECT_REF=main MIKUPROJECT_JAVA_REF=main npm run update:runtime
```

## テスト

root で `vitest` を有効化しています。

```bash
npm install
npm test
```

現状の既定 test 対象:

- `tests/**/*.test.js`

upstream 側 test は upstream 各リポジトリで実行します。
このリポジトリでは、受け取った runtime artifact の存在と CLI contract を smoke test で確認します。

- このリポジトリで重視するのは、skill 側の動作確認と最低限の smoke test
- upstream `mikuproject` 自体の詳細な検証は、まず upstream 側で行われる前提とする
- runtime artifact を差し替えた場合は `npm test` と `npm run build:bundle` を実行する

## 既知メモ: upstream CLI 速度

upstream 側の CLI runtime artifact は、軽い処理でも CLI を毎回起動する固定費が目立つことがあります。

- 簡易計測では、CLI 1 回あたりがおおむね 1 秒前後
- 同じ条件の in-process 計測では、個別の import / patch / export 自体は数 ms から数十 ms 程度

そのため、現時点では「JSON 処理そのもの」よりも、「CLI を毎回 spawn する構造」のほうが支配的に遅い可能性が高いです。
ただし、この repo の skill bundle は runtime artifact 同梱を基本とし、この速度改善対応自体は作業対象に含めません。

## 現在の MVP の前提

- skill は `skills/mikuproject` にある
- 会話境界の state は `mikuproject_workbook_json`
- upstream の Java CLI runtime artifact と Node.js CLI runtime artifact を前提にしている
