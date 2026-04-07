# Proposal for `mikuproject`: unified `XLSX` core API

Status:

- upstream 対応済み

この文書は、`mikuproject-skills` から見た
`mikuproject` upstream への相談メモです。

## 背景

`mikuproject-skills` では Phase B として、
主要交換形式の import / export workflow を扱いたい。

対象:

- `MS Project XML`
- `XLSX`
- `mikuproject_workbook_json`

このうち `MS Project XML` と `mikuproject_workbook_json` については、
`globalThis.__mikuprojectCoreApi` 上に集約入口がある。

一方で `XLSX` については、low-level 実装は存在するが、
同じ粒度の集約 API が見当たらない。

## 現状確認できている実装資産

### workbook-level 変換

- `src/ts/project-xlsx.ts`
  - `__mikuprojectProjectXlsx.exportProjectWorkbook`
  - `__mikuprojectProjectXlsx.importProjectWorkbook`
  - `__mikuprojectProjectXlsx.importProjectWorkbookAsProjectModel`
  - `__mikuprojectProjectXlsx.importProjectWorkbookDetailed`

### binary encode / decode

- `src/ts/excel-io.ts`
  - `__mikuprojectExcelIo.XlsxWorkbookCodec`

### UI 側導線

- `src/ts/main.ts`
  - `importXlsxFromFile`
  - `exportCurrentXlsx`

## 相談したかったこと

`XLSX` についても、`MS Project XML` / `mikuproject_workbook_json` と同様に、
`globalThis.__mikuprojectCoreApi` 上へ集約 API を追加できないか相談したかった。

## 結果

upstream 側で `XLSX` 集約 API が追加された。

少なくとも次が確認できている。

- `globalThis.__mikuprojectCoreApi.xlsx.decodeWorkbook`
- `globalThis.__mikuprojectCoreApi.xlsx.encodeWorkbook`
- `globalThis.__mikuprojectCoreApi.xlsx.exportWorkbook`
- `globalThis.__mikuprojectCoreApi.xlsx.importAsProjectModel`
- `globalThis.__mikuprojectCoreApi.xlsx.importIntoProjectModel`
- `globalThis.__mikuprojectCoreApi.importExternal`

## 相談理由

### 1. Agent Skills / CLI / MCP から扱いにくい

現状でも low-level global を直接使えば実装は可能だが、
利用側で内部構成を知って組み立てる必要がある。

`__mikuprojectCoreApi` に揃っていれば、
Agent Skills / CLI / MCP からの利用面が揃う。

### 2. `XML` / `workbook_json` と入口の粒度を揃えたい

現状は次の非対称がある。

- `MS Project XML`: core API に import/export がある
- `workbook_json`: core API に import/export がある
- `XLSX`: low-level module はあるが core API にない

`XLSX` だけ入口の粒度が違うと、`mikuproject-skills` 側で特別扱いが必要になる。

### 3. binary と workbook-level の責務整理を upstream 側で持ってほしい

`XLSX` は binary encode / decode と workbook-level import / export が分かれている。
これは良い分離だが、利用側としては公開 API 上でまとまっているほうが扱いやすい。

## 提案したい API の方向性

API 名は例であり、確定ではない。

```ts
globalThis.__mikuprojectCoreApi.xlsx = {
  decodeWorkbook(bytes),
  encodeWorkbook(workbook),
  exportWorkbook(model),
  importWorkbookAsProjectModel(workbook),
  importWorkbookIntoProjectModel(workbook, baseModel)
};
```

## 最小提案

最小構成としては、まず次の 3 つでもよい。

- `xlsx.decodeWorkbook(bytes)`
- `xlsx.encodeWorkbook(workbook)`
- `xlsx.exportWorkbook(model)`

この場合でも、`mikuproject-skills` 側は `replace import` を組みやすくなる。

## あると嬉しい追加

- `xlsx.importWorkbookAsProjectModel(workbook)`
- `xlsx.importWorkbookIntoProjectModel(workbook, baseModel)`

これがあると、

- `xlsx-import`
- `xlsx-merge-import`
- `current state -> xlsx-export`

を `core API` 前提で統一しやすい。

## `mikuproject-skills` 側の想定ユースケース

- 利用者が `.xlsx` をアップロードする
- skill が `ProjectModel` に変換する
- 会話境界の state を `mikuproject_workbook_json` に揃える
- 必要に応じて `MS Project XML` / `XLSX` / `mikuproject_workbook_json` に再出力する

## 補足

- この相談は `WBS XLSX` ではなく、構造忠実 workbook `XLSX` の import/export を対象にしている
- `CSV` や report 系出力は今回の相談対象外
- この文書は、相談時点の意図を残す記録として保持する
