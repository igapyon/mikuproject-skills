# Proposal for `mikuproject`: SVG export core API

この文書は、`mikuproject-skills` から見た
`mikuproject` upstream への相談メモです。

## 背景

`mikuproject-skills` では Phase C として、
report / presentation outputs を skill から扱いたい。

その中でも、まず `SVG` ファイル取得について
upstream 側の API 公開面を整理したい。

対象:

- `Daily SVG`
- `Weekly SVG`
- `Monthly Calendar SVG`

## 現状確認できている実装資産

### low-level export

- `src/ts/wbs-svg.ts`
  - `__mikuprojectNativeSvg.exportNativeSvg`
  - `__mikuprojectNativeSvg.exportWeeklyNativeSvg`
  - `__mikuprojectNativeSvg.exportMonthlyWbsCalendarSvgArchive`

### UI 側導線

- `src/ts/main.ts`
  - daily SVG 保存
  - weekly SVG 保存
  - monthly calendar SVG ZIP 保存

## 相談したいこと

`SVG` 系出力についても、
`mikuproject-skills` から扱いやすい `core API` 入口を追加できないか相談したい。

## 相談理由

### 1. `mikuproject-skills` 側は core API を前提にしたい

Phase B で `xlsx` を `core API` に寄せたのと同様に、
Phase C でも upstream API を入口にしたい。

### 2. `Daily / Weekly / Monthly` の公開面を upstream 側で揃えたい

現状は low-level global と UI 側導線はあるが、
skill から扱うには公開面が散っている。

### 3. monthly calendar は返り値の意味づけが重要

`Monthly Calendar SVG` は単一の SVG ではなく、
月ごとの複数 SVG として扱うのが自然である。

これを

- 月別 entries 配列として返すのか
- GUI 保存用 ZIP は別レイヤで組み立てるのか

は upstream 側で整理してもらうほうが自然である。

`mikuproject-skills` 側としては、
core API は ZIP bytes ではなく
月別 SVG entries を返す形が望ましい。

理由:

- 生成AIとのやりとりでは月単位で扱えるほうが使いやすい
- 一部月のみ返す、要約する、といった制御がしやすい
- GUI の download 都合と API の返り値を分離できる

## 提案したい方向性

API 名は例であり、確定ではない。

```ts
globalThis.__mikuprojectCoreApi.report = {
  svg: {
    exportDaily(model, options),
    exportWeekly(model, options),
    exportMonthlyCalendarEntries(model, options)
  }
};
```

あるいは、より単純に:

```ts
globalThis.__mikuprojectCoreApi.svg = {
  exportDaily(model, options),
  exportWeekly(model, options),
  exportMonthlyCalendarEntries(model, options)
};
```

## 最小提案

最小構成としては、まず次でもよい。

- `svg.exportDaily(model, options)`
- `svg.exportWeekly(model, options)`
- `svg.exportMonthlyCalendarEntries(model, options)`

## option 方針

`SVG` 系でも、全出力で options を完全共通化するより、
意味が近いものだけ共通語彙に寄せる方針が妥当と考える。

候補:

- `holidayDates`
- `displayDaysBeforeBaseDate`
- `displayDaysAfterBaseDate`
- `useBusinessDaysForDisplayRange`

一方で、daily / weekly / monthly の表示差に由来するものは、
無理に 1 つの共通 shape に押し込めないほうがよい。

## `mikuproject-skills` 側の想定ユースケース

- current state を `ProjectModel` に戻す
- `Daily SVG` / `Weekly SVG` / `Monthly Calendar SVG` を生成する
- daily / weekly は SVG 文字列として返す
- monthly は月別 SVG entries として返す

## 補足

- この相談は `Mermaid` ではなく SVG ファイル取得を対象にしている
- `WBS XLSX` と同じく、派生表示 API の一部として整理したい
