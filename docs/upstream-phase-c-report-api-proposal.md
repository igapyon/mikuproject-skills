# Proposal for `mikuproject`: Phase C report output core APIs

この文書は、`mikuproject-skills` から見た
`mikuproject` upstream への Phase C 総論メモです。

## 背景

`mikuproject-skills` では、次段として
report / presentation outputs を skill から扱いたい。

対象は次の 3 系統である。

- `WBS XLSX`
- `SVG`
  - `Daily SVG`
  - `Weekly SVG`
  - `Monthly Calendar SVG`
- `Markdown / Mermaid`
  - `WBS Markdown`
  - `Mermaid gantt`

## 相談したいこと

これらの Phase C 出力についても、
`mikuproject-skills` から扱いやすい `core API` 公開面を upstream 側で整理できないか相談したい。

## 基本方針

`mikuproject-skills` 側では、
low-level global を直接組み合わせるよりも、
`mikuproject` の `core API` を呼ぶ構成に寄せたい。

理由:

- Phase B では、主要交換形式を `core API` 前提で整理できた
- Phase C でも同じ方針に揃えたほうが skill 側の責務が増えにくい
- report 系出力は今後も拡張されやすく、upstream 側で公開面を持つ価値が高い

## 今回まとめて相談したい対象

### 1. `WBS XLSX`

現状:

- `__mikuprojectWbsXlsx.exportWbsWorkbook`
- `__mikuprojectWbsXlsx.collectWbsHolidayDates`

相談メモ:

- [upstream-wbs-xlsx-api-proposal.md](./upstream-wbs-xlsx-api-proposal.md)

### 2. `SVG`

現状:

- `__mikuprojectNativeSvg.exportNativeSvg`
- `__mikuprojectNativeSvg.exportWeeklyNativeSvg`
- `__mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive`

相談メモ:

- [upstream-svg-api-proposal.md](./upstream-svg-api-proposal.md)

### 3. `Markdown / Mermaid`

現状:

- `__mikuprojectWbsMarkdown.exportWbsMarkdown`
- `exportMermaidGantt(model)`

相談メモ:

- [upstream-markdown-mermaid-api-proposal.md](./upstream-markdown-mermaid-api-proposal.md)

## 提案したい方向性

API 名は例であり、確定ではない。

```ts
globalThis.__mikuprojectCoreApi.report = {
  wbsXlsx: {
    exportWorkbook(model, options),
    encodeWorkbook(workbook),
    collectHolidayDates(model)
  },
  svg: {
    exportDaily(model, options),
    exportWeekly(model, options),
    exportMonthlyCalendarEntries(model, options)
  },
  markdown: {
    exportWbs(model, options)
  },
  mermaid: {
    exportGantt(model)
  }
};
```

## なぜまとめて相談するのか

この 3 系統は、実装場所は分かれているが、
意味としては同じ `Phase C report outputs` である。

別々に相談するより、少なくとも次を upstream 側でまとめて判断しやすい。

- `core API` に report 系の層を持つか
- `WBS XLSX` / `SVG` / `Markdown` / `Mermaid` をどの粒度で並べるか
- option の公開面をどこまで共通語彙で揃えるか

## option 方針

first cut では、全 export の options を無理に完全統一するよりも、
意味が近いものに共通の名前を与える方針が妥当と考える。

たとえば次のような軸は、複数出力で共通化しやすい。

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`

一方で、出力固有の責務は個別 option のままでよい。

- `WBS XLSX` 固有の workbook / encode 周辺
- `SVG` 固有の weekly / monthly 表示調整
- `WBS Markdown` 固有の progress band 表現
- `Mermaid` 固有の軽量 text export

したがって upstream には、

- 同義の option をできるだけ同じ名前に寄せる
- すべての export に同じ option shape を要求しない
- first cut は各 export の既定動作を優先する

という整理を期待したい。

## monthly calendar の返り値方針

`mikuproject-skills` 側では、
`Monthly Calendar SVG` は ZIP bytes よりも
月別 SVG を個別 entry として取得できるほうが望ましい。

理由:

- 生成AIとのやりとりでは、月別に分けて返せるほうが扱いやすい
- skill 側で一部月のみ返す、要約する、といった制御がしやすい
- GUI の download 導線と、API の返り値都合は分けて考えたほうが自然

そのため、`core API` としては ZIP export よりも、
まず `entries` ベースの返り値を優先したい。

## Mermaid の返り値方針

`Mermaid` については、
upstream の責務は fenced Markdown 生成ではなく、
Mermaid gantt text 自体の export に留めるのが妥当と考える。

fence で包むかどうかは、skills / CLI / docs 側の presentation 層で扱えばよい。

## `mikuproject-skills` 側の想定ユースケース

- current state を `ProjectModel` に戻す
- report 出力を生成する
- `XLSX` / `SVG` / `Markdown` / `Mermaid` を利用者へ返す

## 補足

- この相談は Phase B の主要交換形式とは別系統の話である
- `CSV` や AI 向け編集用 JSON は今回の相談対象外
- 詳細は個別メモを参照しつつ、まずは「まとめて core API 化を検討できるか」を相談したい
