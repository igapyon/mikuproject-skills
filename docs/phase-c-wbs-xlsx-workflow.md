# Phase C Detail: WBS XLSX Export

この文書は、Phase C の最初の詳細仕様として、
`WBS XLSX` の export workflow を整理したものです。

## 対象

- `WBS XLSX` の export

この段階では import は扱わない。

## 位置づけ

`WBS XLSX` は、`MS Project XML` や構造忠実 workbook `XLSX` と異なり、
主要交換形式ではなく report / presentation output として扱う。

したがって、Phase B の primary file workflow とは分けて考える。

## upstream 実装資産

少なくとも次は確認できている。

### low-level export

- `vendor/mikuproject/src/ts/wbs-xlsx.ts`
  - `globalThis.__mikuprojectWbsXlsx.exportWbsWorkbook`
  - `globalThis.__mikuprojectWbsXlsx.collectWbsHolidayDates`

### binary encode

- `vendor/mikuproject/src/ts/excel-io.ts`
  - `globalThis.__mikuprojectExcelIo.XlsxWorkbookCodec`

### UI 側導線

- `vendor/mikuproject/src/ts/main.ts`
  - `exportCurrentWbsXlsx`
  - `buildCurrentWbsOptions(model)`

### test

- `vendor/mikuproject/tests/mikuproject-wbs-xlsx.test.js`
- `vendor/mikuproject/tests/mikuproject-main-preview-export.test.js`

## `mikuproject-skills` 側の基本方針

基本方針としては、`mikuproject` 側で `core API` を用意してもらい、
それを `mikuproject-skills` から呼ぶ形が望ましい。

理由:

- `WBS XLSX` は派生表示であり、今後 `Markdown` / `SVG` / `Mermaid` と並ぶ可能性が高い
- low-level global を skill 側で直接組み合わせ始めると責務が散りやすい
- upstream 側で options の意味を揃えたほうが、後続の report 系展開にも効く

## 想定操作

最初は次の 1 操作で十分。

- `wbs-xlsx-export`

## 入力

- current state

前提:

- current state は `mikuproject_workbook_json` または `ProjectModel`
- report 出力なので baseModel は不要

## 処理

1. current state を `ProjectModel` に揃える
2. `WBS XLSX` export 用 options を決める
3. upstream API で workbook-like object を生成する
4. `.xlsx` bytes に encode する
5. export 結果を返す

## option 論点

upstream 側の `WBS XLSX` には少なくとも次の option が見える。

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`

`mikuproject-skills` の first cut では、option は最小限に絞るのが妥当。

候補:

- 何も指定しない既定 export
- `holidayDates`
- 表示期間の前後日数

## 出力

- one short line saying this is the current `WBS XLSX`
- option summary, when useful
- generated `.xlsx` bytes or file artifact

## エラー方針

### hard error

- current state がない
- `WBS XLSX` 用 workbook の生成に失敗する
- `.xlsx` encode に失敗する

### soft error

- 祝日や表示期間 option の一部が既定値へ丸められる
- upstream 側の表示用補正により、意図どおりに見えない可能性がある

## upstream 相談前提

`WBS XLSX` は現状 `__mikuprojectWbsXlsx` にあるが、
`__mikuprojectCoreApi` には載っていない。

そのため、`mikuproject-skills` 側では
low-level global を直接使う前に、まず upstream 側へ次を相談する前提とする。

- `WBS XLSX` export の core API 化
- option の公開面整理
- `WBS XLSX` を Phase C の他出力とどう並べるか

## 検証根拠

少なくとも次は確認できている。

- `wbs-xlsx.ts` に `exportWbsWorkbook` がある
- `excel-io.ts` で `.xlsx` bytes へ encode できる
- `main.ts` に `exportCurrentWbsXlsx` がある
- `mikuproject-wbs-xlsx.test.js` で表示帯、祝日、表示期間 option がテストされている
