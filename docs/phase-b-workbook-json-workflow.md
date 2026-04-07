# Phase B Detail: mikuproject_workbook_json Import/Export

この文書は、Phase B の詳細仕様として、
`mikuproject_workbook_json` の import / export workflow を整理したものです。

## 対象

- `mikuproject_workbook_json` の import
- `mikuproject_workbook_json` の export

## 位置づけ

`mikuproject_workbook_json` は、Phase A では会話境界の state exchange format として扱った。

Phase B ではこれを、AI handoff 用 JSON というだけでなく、
主要交換形式の一つとして import / export できる対象として扱う。

## upstream API

利用候補:

- `globalThis.__mikuprojectCoreApi.workbookJson.exportDocument`
- `globalThis.__mikuprojectCoreApi.workbookJson.validateDocument`
- `globalThis.__mikuprojectCoreApi.workbookJson.importAsProjectModel`
- `globalThis.__mikuprojectCoreApi.workbookJson.importIntoProjectModel`
- `globalThis.__mikuprojectCoreApi.importAiJsonDocument`

## export

### 入力

- current state

前提:

- current state は `mikuproject_workbook_json` または `ProjectModel`

### 処理

1. current state を確認する
2. current state が `mikuproject_workbook_json` なら、そのまま返す
3. current state が `ProjectModel` なら `workbookJson.exportDocument` で変換する

### 出力

- 出力成功 / 失敗
- resulting `mikuproject_workbook_json`

### 意味

`workbook-export` は、Phase A / Phase B の両方で current state を共有する基準操作である。

## import

`mikuproject_workbook_json` import には 2 通りある。

### 1. replace import

用途:

- 既存 state を丸ごと置き換えたい

処理:

1. workbook JSON を受け取る
2. `workbookJson.importAsProjectModel` で `ProjectModel` に変換する
3. 必要なら warning を取得する
4. 会話境界の state を `mikuproject_workbook_json` に揃える

出力:

- 取込成功 / 失敗
- warning の有無
- resulting `mikuproject_workbook_json`

### 2. merge import

用途:

- 既存 state に対して workbook JSON の変更を部分適用したい

前提:

- base `ProjectModel` が必要

処理:

1. current state を `ProjectModel` に戻す
2. `workbookJson.importIntoProjectModel(documentLike, baseModel)` を使う
3. changes と warnings を受け取る
4. resulting `ProjectModel` を `mikuproject_workbook_json` に戻す

出力:

- 取込成功 / 失敗
- warning の有無
- change summary
- updated `mikuproject_workbook_json`

## Phase B での基本方針

Phase B の初期実装では、まず replace import を優先するのが妥当。

理由:

- current state を明快に扱える
- `MS Project XML` import との対称性がある
- merge import は change summary の扱いまで含めて少し複雑

## current state との関係

`mikuproject_workbook_json` は current state と直接一致しやすい形式である。

そのため:

- export は最も簡単
- import 後も会話境界の state を同じ形式で維持しやすい

## 想定操作

少なくとも次の操作が考えられる。

- `workbook-import`
- `workbook-export`

必要なら将来:

- `workbook-merge-import`

## 返却形式の候補

### `workbook-import`

- 1 行の短い結果説明
- warning があれば短く列挙
- resulting `mikuproject_workbook_json`

### `workbook-export`

- 1 行の短い結果説明
- resulting `mikuproject_workbook_json`

### `workbook-merge-import`

- 1 行の短い結果説明
- warning があれば短く列挙
- change summary
- updated `mikuproject_workbook_json`

## エラー方針

### hard error

- JSON として parse できない
- `format` が `mikuproject_workbook_json` ではない
- `version` が不正
- replace import 時に document が構造要件を満たさない
- merge import 時に current state がない

### soft error

- 未知の sheet が無視される
- 未知の列が無視される
- merge import 時に一部の値だけが反映される

soft error の場合は、結果を返しつつ warning を併記する。

## 検証根拠

少なくとも次は確認できている。

- core API test で workbook JSON の replace / merge が確認されている
- `project-workbook-json.ts` に validation / export / replace import / merge import がある

## 次の論点

- Phase B では merge import を最初から入れるか
- `skills/mikuproject/SKILL.md` に取り込む場合、Phase A の `workbook` とどう役割を分けるか
