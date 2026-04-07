# Phase B Detail: MS Project XML Import/Export

この文書は、Phase B の最初の詳細仕様として、
`MS Project XML` の import / export workflow を整理したものです。

## 対象

- `MS Project XML` の import
- `MS Project XML` の export

## 位置づけ

これは `mikuproject-skills` の AI JSON workflow とは別軸の、
主要ファイル形式 workflow の一部である。

この workflow は次のように使うことを想定する。

- 既存の `MS Project XML` を取り込み、skill の current state にする
- current state から `MS Project XML` を再出力する
- `MS Project XML` と AI JSON workflow を橋渡しする

## upstream API

Phase B の `MS Project XML` workflow では、次の公開 API を利用候補とする。

- `globalThis.__mikuprojectCoreApi.msProject.importFromXml`
- `globalThis.__mikuprojectCoreApi.msProject.exportToXml`
- `globalThis.__mikuprojectCoreApi.projectModel.validate`
- `globalThis.__mikuprojectCoreApi.workbookJson.exportDocument`

## import

### 入力

- `MS Project XML` テキスト

### 処理

1. XML テキストを受け取る
2. `msProject.importFromXml` で `ProjectModel` に変換する
3. 必要なら `projectModel.validate` で検証する
4. `workbookJson.exportDocument` で `mikuproject_workbook_json` に変換する
5. 会話境界の current state を `mikuproject_workbook_json` に揃える

### 出力

- 取込成功 / 失敗
- validation issue の有無
- 生成された `mikuproject_workbook_json`

### 意味

`MS Project XML` import は、file workflow から AI JSON workflow へ入る入口である。

## export

### 入力

- current state

前提:

- current state は `mikuproject_workbook_json` または `ProjectModel`

### 処理

1. current state を確認する
2. current state が `mikuproject_workbook_json` なら `ProjectModel` へ戻す
3. `msProject.exportToXml` で XML テキストを生成する
4. 必要なら `projectModel.validate` の結果を併記する

### 出力

- 出力成功 / 失敗
- validation issue の有無
- 生成された `MS Project XML`

### 意味

`MS Project XML` export は、skill 上の current state を交換形式へ戻す出口である。

## current state との関係

Phase A と同様に、会話境界の state は `mikuproject_workbook_json` を優先する。

そのため `MS Project XML` を直接 current state として持ち回るのではなく、
import 後は `mikuproject_workbook_json` に正規化する。

## 想定操作

この detailed workflow では、少なくとも次の 2 操作が考えられる。

- `xml-import`
- `xml-export`

## 返却形式の候補

### `xml-import`

- 1 行の短い結果説明
- validation issue があれば短く列挙
- resulting `mikuproject_workbook_json`

### `xml-export`

- 1 行の短い結果説明
- validation issue があれば短く列挙
- resulting `MS Project XML`

## エラー方針

### hard error

- 入力が XML として parse できない
- `msProject.importFromXml` が失敗する
- export 時に current state がない

### soft error

- `ProjectModel` validation で issue が出る

soft error の場合は継続し、結果と issue を返す。

## 検証根拠

既存 upstream で、少なくとも次は確認できている。

- `globalThis.__mikuprojectCoreApi.msProject.importFromXml`
- `globalThis.__mikuprojectCoreApi.msProject.exportToXml`
- XML round-trip テスト群
- preview/export 系テストでの XML export 導線

## 次の論点

- `xml-import` / `xml-export` を `skills/mikuproject/SKILL.md` に含めるか
- まずは Phase B 用の別 skill に切り出すか
- validation issue の返却粒度をどこまで詳しくするか
