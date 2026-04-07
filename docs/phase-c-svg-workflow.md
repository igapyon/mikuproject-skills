# Phase C Detail: SVG Outputs

この文書は、Phase C の詳細仕様メモとして、
`SVG` 系出力を整理したものです。

## 対象

この段階で対象にするのは次の 3 系統。

- `Daily SVG`
- `Weekly SVG`
- `Monthly Calendar SVG`

この文書では `Mermaid` は別扱いとし、
まず `SVG` ファイル取得に絞る。

## 位置づけ

`SVG` 系出力は、Phase B の主要交換形式ではなく、
report / presentation output として扱う。

`WBS XLSX` と同じく、ProjectModel から派生表示を生成する出力である。

## upstream 実装資産

少なくとも次は確認できている。

### low-level export

- `vendor/mikuproject/src/ts/wbs-svg.ts`
  - `globalThis.__mikuprojectNativeSvg.exportNativeSvg`
  - `globalThis.__mikuprojectNativeSvg.exportWeeklyNativeSvg`
  - `globalThis.__mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive`

### UI 側導線

- `vendor/mikuproject/src/ts/main.ts`
  - `downloadSvgBtn` 相当の daily SVG 保存処理
  - weekly SVG 保存処理
  - monthly calendar SVG ZIP 保存処理

### test

- `vendor/mikuproject/tests/mikuproject-main-preview-export.test.js`
- `vendor/mikuproject/tests/mikuproject-main-preview-svg.test.js`

## `mikuproject-skills` 側の基本方針

基本方針としては、`mikuproject` 側で `core API` を用意してもらい、
それを `mikuproject-skills` から呼ぶ形が望ましい。

理由:

- `SVG` は派生表示であり、今後も表示仕様の変更が入りやすい
- low-level global を skill 側で直接組み始めると、
  option や返り値の意味づけが skill 側へ漏れる
- `Daily / Weekly / Monthly` をまとめて公開面整理したほうが、
  `WBS XLSX` や `Markdown` と並べやすい

## 想定操作

最初の候補は次の 3 つ。

- `daily-svg-export`
- `weekly-svg-export`
- `monthly-calendar-svg-export`

## 入力

- current state

前提:

- current state は `mikuproject_workbook_json` または `ProjectModel`

## 処理

### `daily-svg-export`

1. current state を `ProjectModel` に揃える
2. export option を決める
3. upstream API で daily SVG 文字列を生成する
4. SVG 文字列を返す

### `weekly-svg-export`

1. current state を `ProjectModel` に揃える
2. export option を決める
3. upstream API で weekly SVG 文字列を生成する
4. SVG 文字列を返す

### `monthly-calendar-svg-export`

1. current state を `ProjectModel` に揃える
2. upstream API で月別 SVG entries を生成する
3. 月別 SVG 群として返す

## option 論点

現時点では、少なくとも次が論点になる。

- 表示期間
- holiday / business day の扱い
- label mode
- monthly calendar を月別 entries としてどう返すか

first cut では、skill 側で option を増やしすぎず、
既定 export をまず成立させるのが妥当。

また、全 SVG export で options を完全統一するより、
意味が近いものだけ共通語彙に寄せる方針が妥当。

候補:

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`

## 出力

### `daily-svg-export`

- one short line saying this is the current daily SVG
- generated SVG text

### `weekly-svg-export`

- one short line saying this is the current weekly SVG
- generated SVG text

### `monthly-calendar-svg-export`

- one short line saying this is the monthly calendar SVG export
- generated monthly SVG entries

## エラー方針

### hard error

- current state がない
- SVG 生成結果が空
- monthly entries を生成できない

### soft error

- export option の一部が既定値へ丸められる
- preview 向け既定と file export 向け既定の差がある

## upstream 相談前提

`SVG` 系は現状 `__mikuprojectNativeSvg` にあるが、
`__mikuprojectCoreApi` には載っていない。

そのため、`mikuproject-skills` 側では
low-level global を直接使う前に、まず upstream 側へ次を相談する前提とする。

- `Daily / Weekly / Monthly Calendar SVG` export の core API 化
- option の公開面整理
- monthly calendar entries の返り値の整理

## 検証根拠

少なくとも次は確認できている。

- `wbs-svg.ts` に daily / weekly / monthly calendar の export 実装がある
- `main.ts` に各出力の download 導線がある
- preview/export 系 test に SVG 保存の確認がある
