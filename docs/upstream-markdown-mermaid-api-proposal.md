# Proposal for `mikuproject`: Markdown and Mermaid core API

この文書は、`mikuproject-skills` から見た
`mikuproject` upstream への相談メモです。

## 背景

`mikuproject-skills` では Phase C として、
report / presentation outputs を skill から扱いたい。

その中で、`WBS Markdown` と `Mermaid` についても
upstream 側の API 公開面を整理したい。

対象:

- `WBS Markdown`
- `Mermaid`

## 現状確認できている実装資産

### `WBS Markdown`

- `src/js/wbs-markdown.js`
  - `__mikuprojectWbsMarkdown.exportWbsMarkdown`

### `Mermaid`

- `src/js/msproject-xml.js`
  - `exportMermaidGantt(model)`

### UI 側導線

- `src/js/main.js`
  - `downloadCurrentWbsMarkdown`
  - `downloadCurrentMermaidMarkdown`

## 相談したいこと

`WBS Markdown` と `Mermaid` についても、
`mikuproject-skills` から扱いやすい `core API` 入口を追加できないか相談したい。

## 相談理由

### 1. report 系出力を `core API` 前提で揃えたい

`XLSX` と同様に、skills 側では可能な限り upstream API を入口にしたい。

### 2. `WBS XLSX` / `SVG` / `Markdown` / `Mermaid` を同じ層で整理したい

report 系出力は今後並列に扱う見込みがあるため、
公開面を upstream 側で揃えたほうが扱いやすい。

### 3. `Mermaid` は現状 XML module 側にあり、責務が散っている

`Mermaid` 出力自体は意味的に自然だが、
skills 側から見ると `core API` 経由で呼べたほうが分かりやすい。

### 4. `Mermaid` の presentation 層責務は upstream に持たせすぎない

`Mermaid` については、fenced Markdown まで upstream が返すより、
Mermaid gantt text をそのまま返すほうが責務分離が明確である。

fence を付けるかどうかは、
skills / CLI / docs 側で決めればよい。

## 提案したい方向性

API 名は例であり、確定ではない。

```ts
globalThis.__mikuprojectCoreApi.report = {
  markdown: {
    exportWbs(model, options)
  },
  mermaid: {
    exportGantt(model)
  }
};
```

あるいは、より単純に:

```ts
globalThis.__mikuprojectCoreApi.wbsMarkdown = {
  export(model, options)
};

globalThis.__mikuprojectCoreApi.mermaid = {
  exportGantt(model)
};
```

## 最小提案

最小構成としては、まず次でもよい。

- `report.markdown.exportWbs(model, options)`
- `report.mermaid.exportGantt(model)`

## option 方針

`WBS Markdown` では、
`WBS XLSX` と意味が近い option 名は共通語彙に寄せたい。

候補:

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`

ただし、`useBusinessDaysForProgressBand` のような
`WBS Markdown` 固有の表現は個別 option でよい。

`Mermaid` は first cut では option をほぼ持たず、
既定 export のみをまず core API 化するのが妥当と考える。

## `mikuproject-skills` 側の想定ユースケース

- current state を `ProjectModel` に戻す
- `WBS Markdown` をテキストとして返す
- `Mermaid` を gantt text として返す

## 補足

- この相談は `WBS記述書 Markdown` のような次段の派生出力は含まない
- まずは `WBS Markdown` と `Mermaid` の basic export を対象にする
