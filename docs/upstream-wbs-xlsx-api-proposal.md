# Proposal for `mikuproject`: `WBS XLSX` core API

この文書は、`mikuproject-skills` から見た
`mikuproject` upstream への相談メモです。

## 背景

`mikuproject-skills` では Phase C として、
report / presentation outputs を skill から扱いたい。

最初の候補は `WBS XLSX` である。

## 現状確認できている実装資産

### workbook-level export

- `src/ts/wbs-xlsx.ts`
  - `__mikuprojectWbsXlsx.exportWbsWorkbook`
  - `__mikuprojectWbsXlsx.collectWbsHolidayDates`

### binary encode

- `src/ts/excel-io.ts`
  - `__mikuprojectExcelIo.XlsxWorkbookCodec`

### UI 側導線

- `src/ts/main.ts`
  - `exportCurrentWbsXlsx`
  - `buildCurrentWbsOptions(model)`

## 相談したいこと

`WBS XLSX` export についても、
`mikuproject-skills` から扱いやすい `core API` 入口を追加できないか相談したい。

## 相談理由

### 1. Phase B と同様に upstream API を入口にしたい

`mikuproject-skills` 側では、可能な限り `mikuproject` の `core API` を呼ぶ方針にしたい。

`WBS XLSX` だけ low-level global を直接触る形にすると、
skill 側で実装責務が増える。

### 2. `WBS XLSX` は low-level option の意味づけが強い

`holidayDates` や表示期間 option など、
UI と表示仕様に関係する option がある。

これを `mikuproject-skills` 側で勝手に再解釈するより、
upstream 側で公開面を定義してもらうほうが自然である。

### 3. 後続の `Markdown` / `SVG` / `Mermaid` と並べやすくしたい

Phase C は `WBS XLSX` だけで終わらず、
後続で `Markdown` / `SVG` / `Mermaid` に広がる見込みがある。

その最初として、`WBS XLSX` の core API 化は意味がある。

## 提案したい方向性

API 名は例であり、確定ではない。

```ts
globalThis.__mikuprojectCoreApi.report = {
  wbsXlsx: {
    collectHolidayDates(model),
    exportWorkbook(model, options),
    encodeWorkbook(workbook)
  }
};
```

あるいは、より単純に:

```ts
globalThis.__mikuprojectCoreApi.wbsXlsx = {
  collectHolidayDates(model),
  exportWorkbook(model, options),
  encodeWorkbook(workbook)
};
```

## 最小提案

最小構成としては、まず次でもよい。

- `wbsXlsx.exportWorkbook(model, options)`
- `wbsXlsx.encodeWorkbook(workbook)`

これだけでも、`mikuproject-skills` 側は `WBS XLSX` export を組みやすくなる。

## `mikuproject-skills` 側の想定ユースケース

- current state を `ProjectModel` に戻す
- `WBS XLSX` を生成する
- `.xlsx` bytes として利用者に返す

## 補足

- この相談は report / presentation output としての `WBS XLSX` を対象にしている
- 構造忠実 workbook `XLSX` とは別物として扱う
