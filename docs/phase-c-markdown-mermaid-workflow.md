# Phase C Detail: Markdown and Mermaid Outputs

この文書は、Phase C の詳細仕様メモとして、
`WBS Markdown` と `Mermaid` 出力を整理したものです。

## 対象

- `WBS Markdown`
- `Mermaid Markdown`

この段階では、`WBS記述書 Markdown` などの派生 Markdown は対象外とする。

## 位置づけ

`WBS Markdown` と `Mermaid` は、Phase B の主要交換形式ではなく、
report / presentation output として扱う。

- `WBS Markdown`: 人が読むための軽量テキスト共有用
- `Mermaid`: 設計資料や Markdown へ貼るための軽量 gantt 表現

## upstream 実装資産

少なくとも次は確認できている。

### `WBS Markdown`

- `vendor/mikuproject/src/js/wbs-markdown.js`
  - `globalThis.__mikuprojectWbsMarkdown.exportWbsMarkdown`

### `Mermaid`

- `vendor/mikuproject/src/js/msproject-xml.js`
  - `exportMermaidGantt(model)`

### UI 側導線

- `vendor/mikuproject/src/js/main.js`
  - `downloadCurrentWbsMarkdown`
  - `downloadCurrentMermaidMarkdown`

### test

- `vendor/mikuproject/tests/mikuproject-wbs-markdown.test.js`
- `vendor/mikuproject/tests/mikuproject-main-preview-export.test.js`

## `mikuproject-skills` 側の基本方針

基本方針としては、`mikuproject` 側で `core API` を用意してもらい、
それを `mikuproject-skills` から呼ぶ形が望ましい。

理由:

- `WBS Markdown` と `Mermaid` は report 系出力であり、`WBS XLSX` / `SVG` と並ぶ
- 現状は low-level global や XML module の関数として分散している
- skills 側で直接組み始めるより、upstream 側で公開面を揃えたほうが今後の拡張に強い

## 想定操作

最初の候補は次の 2 つ。

- `wbs-markdown-export`
- `mermaid-export`

## 入力

- current state

前提:

- current state は `mikuproject_workbook_json` または `ProjectModel`

## 処理

### `wbs-markdown-export`

1. current state を `ProjectModel` に揃える
2. export option を決める
3. upstream API で `WBS Markdown` 文字列を生成する
4. Markdown 文字列を返す

### `mermaid-export`

1. current state を `ProjectModel` に揃える
2. upstream API で Mermaid gantt text を生成する
3. Mermaid gantt text をそのまま返す

## option 論点

`WBS Markdown` では、少なくとも次が論点になる。

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`
- `useBusinessDaysForProgressBand`

`Mermaid` では first cut では option をほぼ持たず、
まず既定 export を成立させるので十分。

また、`WBS Markdown` では
`WBS XLSX` と意味が近い option 名を共通語彙に寄せるのが望ましい。

候補:

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`

## 出力

### `wbs-markdown-export`

- one short line saying this is the current `WBS Markdown`
- generated Markdown text

### `mermaid-export`

- one short line saying this is the current Mermaid export
- generated Mermaid gantt text

## エラー方針

### hard error

- current state がない
- export 結果が空

### soft error

- option の一部が既定値へ丸められる
- Markdown / Mermaid の表現上、一部情報が簡略化される

## upstream 相談前提

`WBS Markdown` は `__mikuprojectWbsMarkdown`、
`Mermaid` は `msproject-xml` の export 関数にあるが、
どちらも `__mikuprojectCoreApi` には載っていない。

そのため、`mikuproject-skills` 側では
low-level global や XML module を直接使う前に、まず upstream 側へ次を相談する前提とする。

- `WBS Markdown` export の core API 化
- `Mermaid` export の core API 化
- report 系出力の公開面整理

## 検証根拠

少なくとも次は確認できている。

- `wbs-markdown.js` に `exportWbsMarkdown` がある
- `msproject-xml.js` に `exportMermaidGantt` がある
- `main.js` に `WBS Markdown` と `Mermaid Markdown` の保存導線がある
- `mikuproject-wbs-markdown.test.js` に `WBS Markdown` の test がある
