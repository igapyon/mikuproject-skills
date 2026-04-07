# Phase B: Primary File Import/Export Workflow

この文書は、`mikuproject-skills` における次フェーズ候補として、
主要交換形式の import / export workflow を整理した仕様メモです。

## 位置づけ

Phase A では、AI JSON workflow を扱った。

- `spec`
- `draft`
- `patch`
- `workbook`

Phase B では、その次段として、主要ファイル形式の import / export を扱う。

## 対象

Phase B の対象は次の 3 形式とする。

- `MS Project XML`
- `XLSX`
- `mikuproject_workbook_json`

各形式について、import と export の両方を扱う。

## 対象外

この段階では次は対象外とする。

- `CSV`
- AI 向け編集用 JSON 群
  - `project_overview_view`
  - `phase_detail_view`
  - `task_edit_view`
  - `full bundle`
- レポート / 可視化専用出力
  - `WBS XLSX`
  - `SVG`
  - `Markdown`
  - `Mermaid`

## 目的

Phase B の目的は、`mikuproject` の Output / Input 画面で扱う主要交換形式を、
skill 側でも import / export できるようにすることである。

これは AI JSON workflow を置き換えるものではなく、別軸の file workflow として扱う。

## 想定ユースケース

### 1. 既存 XML を読み込んで AI workflow へつなげる

- 利用者が `MS Project XML` を持っている
- skill がそれを内部状態へ変換する
- その状態から `mikuproject_workbook_json` を返し、AI workflow へつなぐ

### 2. 既存 XLSX を読み込んで AI workflow へつなげる

- 利用者が `XLSX` を持っている
- skill がそれを内部状態へ変換する
- その状態から `mikuproject_workbook_json` を返す

### 3. workbook JSON を読み込んで export し直す

- 利用者が `mikuproject_workbook_json` を持っている
- skill がそれを内部状態へ変換する
- 必要に応じて `MS Project XML` や `XLSX` に export する

### 4. 現在状態からファイル形式を出力する

- skill が current state を持っている
- 利用者が `MS Project XML` / `XLSX` / `mikuproject_workbook_json` のいずれかを欲しがる
- skill が requested format に export する

## 状態方針

Phase A と同様に、会話境界の state は `mikuproject_workbook_json` を優先する。

ただし file workflow の処理中には、必要に応じて次の内部変換を行う。

- `MS Project XML -> ProjectModel`
- `XLSX -> ProjectModel`
- `mikuproject_workbook_json -> ProjectModel`
- `ProjectModel -> MS Project XML`
- `ProjectModel -> XLSX`
- `ProjectModel -> mikuproject_workbook_json`

## upstream API と実装資産

### 1. `MS Project XML`

利用候補:

- `globalThis.__mikuprojectCoreApi.msProject.importFromXml`
- `globalThis.__mikuprojectCoreApi.msProject.exportToXml`

### 2. `mikuproject_workbook_json`

利用候補:

- `globalThis.__mikuprojectCoreApi.workbookJson.importAsProjectModel`
- `globalThis.__mikuprojectCoreApi.workbookJson.importIntoProjectModel`
- `globalThis.__mikuprojectCoreApi.workbookJson.exportDocument`

### 3. `XLSX`

確認できている低レベル資産:

- `vendor/mikuproject/src/ts/project-xlsx.ts`
- `vendor/mikuproject/src/ts/excel-io.ts`

確認できている UI 側の導線:

- `vendor/mikuproject/src/ts/main.ts` の `importXlsxFromFile`
- `vendor/mikuproject/src/ts/main.ts` の `exportCurrentXlsx`

注意:

- 現時点では `MS Project XML` と workbook JSON ほどには、
  unified core API 上に `XLSX` の安定した集約入口が見えていない
- Phase B では、`XLSX` を skill 側から扱いやすくする入口をどう持つかが論点になる

## 操作候補

Phase B では、少なくとも次の操作を定義する余地がある。

- `xml-import`
- `xml-export`
- `xlsx-import`
- `xlsx-export`
- `workbook-import`
- `workbook-export`

## 最小仕様の切り方

実装順としては、次の順が妥当。

1. `MS Project XML` import / export
2. `mikuproject_workbook_json` import / export
3. `XLSX` import / export

理由:

- `MS Project XML` と workbook JSON は upstream の公開 API が比較的明確
- `XLSX` は低レベル資産はあるが、skill 側からの入口整理がもう少し必要

## エラー方針

### hard error

- 入力が対象形式として parse できない
- import 対象が current state を要求するが state がない
- export 対象が current state を要求するが state がない

### soft error

- import 時に upstream warning が返る
- merge 的な取り込みで一部列や一部値が無視される

## 開発上の論点

- `XLSX` を unified core API に寄せる必要があるか
- file import/export でも current state は `mikuproject_workbook_json` に揃えるか
- binary を含む `XLSX` の受け渡しを skill 上でどう表現するか

## 次アクション候補

- Phase B 用の upstream 調査を追加で行う
- 特に `XLSX` import / export の skill 向け入口を確認する
- `MS Project XML` / workbook JSON から先に詳細仕様を起こす
