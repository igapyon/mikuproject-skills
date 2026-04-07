# Agent Skill Design

`mikuproject-skills` の MVP 向け Agent Skill 設計メモです。

## 方針

MVP では、`spec` / `draft` / `patch` / `workbook` を別 skill に分割しない。
まずは 1 つの `mikuproject` skill として成立させる。

理由:

- 利用者から見ると 4 機能は 1 つの往復フローを構成している
- upstream 側に `globalThis.__mikuprojectCoreApi` が追加され、単一入口で扱いやすくなった
- 初期段階で skill を分けすぎると、状態管理と呼び分けが複雑になる

## MVP Skill の責務

Skill は次の 4 機能を担当する。

- `mikuproject-ai-json-spec` を提示する
- 生成AIが返した `project_draft_view` を受け取って処理する
- 生成AIが返した `Patch JSON` を受け取って処理する
- 現在状態を `mikuproject_workbook_json` として生成AIに渡せる形にする

Skill は WBS 編集 UI の代替を目指さない。
MVP の責務は、生成AIとの構造化 I/O を安定して往復させることである。

## Skill 名称

第一候補:

- `mikuproject`

候補理由:

- upstream 名と一致していて理解しやすい
- `mikuproject` 固有の JSON 仕様と往復フローを扱う skill であることが明確

代替候補:

- `mikuproject-wbs`
- `mikuproject-ai-json`

MVP では `mikuproject` を採用する想定とする。

## 想定する利用シーン

### 1. 新規 WBS 草案を作る

- 利用者が要件や制約を文章で与える
- Skill が `mikuproject-ai-json-spec` を提示する
- 生成AI が `project_draft_view` を返す
- Skill がそれを受け取って `mikuproject` 形式の状態へ変換する

### 2. 既存 WBS を AI に修正させる

- Skill が現在状態を `mikuproject_workbook_json` として出力する
- 利用者がそれを生成AIへ渡す
- 生成AI が `Patch JSON` を返す
- Skill が Patch を適用する

## 状態管理方針

MVP では、Agent Skill の会話境界における状態保持形式は
`mikuproject_workbook_json` を優先する。

ただし、これは `mikuproject` の内部基軸が `MS Project XML` であることを
否定しない。Skill は会話と JSON 往復を扱う層なので、会話境界では
`mikuproject_workbook_json` を主に保持し、内部処理では必要に応じて
`ProjectModel` および `MS Project XML` へ変換する。

理由:

- JSON として扱いやすい
- upstream に import/export API がある
- `ProjectModel` や `MS Project XML` を skill 外へ長期保持するより扱いやすい
- `project_draft_view` と `Patch JSON` の両方の中間状態として使える

補足:

- `MS Project XML` は upstream の基軸・互換形式である
- `mikuproject_workbook_json` は Agent Skill が扱いやすい周辺表現である
- MVP では、必要な情報は `mikuproject_workbook_json` で十分に往復できる前提を置く
- 将来 `workbook_json` に載らない情報を skill で扱う必要が出た場合は、状態保持方針を再検討する

基本変換フロー:

- 新規草案: `project_draft_view -> ProjectModel -> mikuproject_workbook_json`
- 既存修正: `mikuproject_workbook_json -> ProjectModel -> Patch JSON apply -> mikuproject_workbook_json`
- 必要時: `ProjectModel -> MS Project XML`

## upstream API の利用方針

MVP では、次の upstream API を主要入口とする。

- `globalThis.__mikuprojectAiJsonSpec`
- `globalThis.__mikuprojectCoreApi`

主に使う想定の関数:

- `getAiJsonSpecText()`
- `getAiJsonSpec()`
- `parseAiJsonText()`
- `importAiJsonDocument()`
- `importAiJsonText()`
- `workbookJson.exportDocument()`
- `workbookJson.importAsProjectModel()`
- `patchJson.applyToProjectModel()`

## 操作単位

MVP では、Skill の責務を 4 つの操作単位として定義する。

### `spec`

入力:

- なし、または利用者の簡単な要求

出力:

- `mikuproject-ai-json-spec` の本文
- 必要なら version
- 利用者が生成AIへ渡すための最小補足文

### `draft`

入力:

- 生成AIが返した `project_draft_view`
- `json` フェンス付き全文でも可

出力:

- 取込成功/失敗
- warning の有無
- 変換後の `mikuproject_workbook_json`

### `patch`

入力:

- 現在の `mikuproject_workbook_json`
- 生成AIが返した `Patch JSON`

出力:

- 反映成功/失敗
- warning の有無
- change summary
- 更新後の `mikuproject_workbook_json`

### `workbook`

入力:

- 現在の `mikuproject_workbook_json`

出力:

- そのまま生成AIへ渡せる `mikuproject_workbook_json`
- 必要なら補足プロンプト

## 会話上の取り扱い

Skill は次のように振る舞う。

- `spec` 要求では prompt/spec を返す
- `draft` 要求では `project_draft_view` を検出して取り込む
- `patch` 要求では `Patch JSON` を検出して適用する
- `workbook` 要求では current workbook を返す

利用者が document kind を明示しなくても、中身から判定する。
判定不能ならエラーにする。

## エラー方針

### hard error

- JSON として parse できない
- `view_type` / `format` / `operations` から kind を判定できない
- `Patch JSON` なのに base 状態がない
- `project_draft_view` / workbook JSON の必須項目が不足している

### soft error

- upstream validator が warning を返した
- Patch の一部 operation が無視された
- workbook JSON の未知列や未知 sheet が無視された

soft error の場合は処理継続し、warning を返す。

## 人手が必要な境界

MVP では次は人手または別会話に委ねる。

- 生成AIへ実際に prompt を渡す作業
- `mikuproject` ブラウザ UI 上での目視確認
- WBS 内容の業務妥当性判断
- SVG / XLSX / Markdown の出力活用

## MVP 以外

次は MVP では扱わない。

- MCP 化
- 複数 skill への分割
- `task_edit_view` / `phase_detail_view` を用いた高度な局所編集
- 自動レビューや自動再計画
- UI 操作の自動化

## 実装含意

MVP 実装では少なくとも次が必要になる。

- skill の `SKILL.md`
- `spec` / `draft` / `patch` / `workbook` の会話ルール
- 状態として扱う `mikuproject_workbook_json` の保存方針
- upstream API を呼ぶ補助コードまたは手順
