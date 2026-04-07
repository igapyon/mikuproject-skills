# Phase B Detail: XLSX Import/Export

この文書は、Phase B の詳細仕様として、
`XLSX` の import / export workflow を整理したものです。

## 対象

- 構造忠実 workbook `XLSX` の import
- 構造忠実 workbook `XLSX` の export

この段階では、表示専用の `WBS XLSX` は対象外とする。

## 位置づけ

`mikuproject` における `XLSX` は、`MS Project XML` の代替正本ではない。

- `MS Project XML` は意味の基軸
- `ProjectModel` は内部の中立表現
- `XLSX` は確認・可視化・限定編集のための周辺表現

したがって Phase B の `XLSX` workflow も、
`XLSX` を正本として固定するためではなく、
`ProjectModel` と会話境界の state をつなぐ補助経路として扱う。

## upstream 実装資産

少なくとも次は確認できている。

### low-level workbook 変換

- `vendor/mikuproject/src/ts/project-xlsx.ts`
  - `globalThis.__mikuprojectProjectXlsx.exportProjectWorkbook`
  - `globalThis.__mikuprojectProjectXlsx.importProjectWorkbook`
  - `globalThis.__mikuprojectProjectXlsx.importProjectWorkbookAsProjectModel`
  - `globalThis.__mikuprojectProjectXlsx.importProjectWorkbookDetailed`

### binary encode / decode

- `vendor/mikuproject/src/ts/excel-io.ts`
  - `globalThis.__mikuprojectExcelIo.XlsxWorkbookCodec`

### UI 側導線

- `vendor/mikuproject/src/ts/main.ts`
  - `importXlsxFromFile`
  - `exportCurrentXlsx`

## upstream API

現在は `globalThis.__mikuprojectCoreApi` 上に、
`XLSX` の集約入口が追加されている。

利用候補:

- `globalThis.__mikuprojectCoreApi.xlsx.decodeWorkbook`
- `globalThis.__mikuprojectCoreApi.xlsx.encodeWorkbook`
- `globalThis.__mikuprojectCoreApi.xlsx.exportWorkbook`
- `globalThis.__mikuprojectCoreApi.xlsx.importAsProjectModel`
- `globalThis.__mikuprojectCoreApi.xlsx.importIntoProjectModel`
- `globalThis.__mikuprojectCoreApi.importExternal`

したがって、Phase B の `XLSX` workflow は、
low-level global を直接触らずに `core API` 前提で設計できる。

## import

### 入力

- `.xlsx` binary
- または decode 済み workbook-like object

Phase B の skill 仕様では、最終的な受け口は binary を想定する。
ただし内部仕様としては、いったん workbook-like object に decode して扱う。

### replace import

用途:

- `XLSX` 全体を現在 state として読み込みたい

処理:

1. `.xlsx` binary を受け取る
2. `coreApi.xlsx.decodeWorkbook` で workbook-like object に decode する
3. `coreApi.xlsx.importAsProjectModel` で `ProjectModel` に変換する
4. validation を行う
5. `workbookJson.exportDocument` で `mikuproject_workbook_json` に揃える

別案として、`coreApi.importExternal({ source: { format: "xlsx", bytes }, mode: "replace" })`
を使う構成も取れる。

出力:

- 取込成功 / 失敗
- warning の有無
- resulting `mikuproject_workbook_json`

### merge import

用途:

- 既存 state に対して `XLSX` 上の編集を部分反映したい

前提:

- base `ProjectModel` が必要

処理:

1. current state を `ProjectModel` に戻す
2. `.xlsx` binary を decode する
3. `coreApi.importExternal({ source: { format: "xlsx", bytes }, mode: "merge", baseModel })`
   で change を取得する
4. resulting `ProjectModel` を `mikuproject_workbook_json` に戻す

出力:

- 取込成功 / 失敗
- change summary
- warning の有無
- updated `mikuproject_workbook_json`

## export

### 入力

- current state

前提:

- current state は `mikuproject_workbook_json` または `ProjectModel`

### 処理

1. current state を `ProjectModel` に揃える
2. `coreApi.xlsx.exportWorkbook(model)` で workbook-like object を生成する
3. `coreApi.xlsx.encodeWorkbook(workbook)` で `.xlsx` binary に encode する

### 出力

- 出力成功 / 失敗
- generated `.xlsx` binary

必要に応じて付加情報として次を返してよい。

- workbook sheet 名一覧
- encode 前 workbook の軽い summary

## current state との関係

Phase B でも、会話境界の state は引き続き `mikuproject_workbook_json` を優先する。

つまり `XLSX` は次のいずれかとして扱う。

- import 元
- export 先

skill 内部で長く `XLSX` binary を正本として保持する前提にはしない。

## Phase B 初期実装の優先順

`XLSX` でも、最初は次の順が妥当。

1. `xlsx-export`
2. `xlsx-import` の replace import
3. `xlsx-import` の merge import

理由:

- export のほうが current state からの一方向変換で分かりやすい
- replace import は `MS Project XML` import と対称に扱える
- merge import は change summary と warning の整理が少し重い

## 想定操作

少なくとも次の操作が考えられる。

- `xlsx-export`
- `xlsx-import`

必要なら将来:

- `xlsx-merge-import`

## エラー方針

### hard error

- `.xlsx` binary を decode できない
- workbook 構造が必要シートを満たさない
- current state が必要なのに存在しない
- encode に失敗する

### soft error

- import 時に未知の列や非対応列が無視される
- import 時に一部値だけが反映される
- validation issue が返る

soft error の場合は、結果を返しつつ warning を併記する。

## 補足

`xlsx` 集約 API は upstream 側で対応済みになったため、
Phase B ではその API を前提に `skills/mikuproject` へ取り込める。

## 検証根拠

少なくとも次は確認できている。

- `project-xlsx.ts` に workbook export / replace import / merge import がある
- `excel-io.ts` に `XlsxWorkbookCodec` がある
- UI 側には `main.ts` 経由の `XLSX import/export` 導線がある
- `core-api.ts` に `xlsx` 集約入口と `importExternal` が追加されている
