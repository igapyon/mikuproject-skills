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

## handoff 型と agent-to-agent 型

MVP の現在設計は handoff 型である。

これは、skill が `spec` や `mikuproject_workbook_json` を画面に返し、
その返却内容を利用者または上位エージェントが次の生成AIへ渡す形を意味する。

たとえば `spec` では、skill 自身が外部の生成AIと自動対話するのではなく、
次の AI ターンへ渡すための `mikuproject-ai-json-spec` を返す。

したがって、`spec` 実行時に spec 本文や handoff 用プロンプトが画面に表示されるのは、
MVP の想定どおりの挙動である。

一方で、将来の理想形としては agent-to-agent 型もありうる。

これは、skill の返却内容を画面にそのまま見せるのではなく、
オーケストレータまたは上位エージェントが内部的に次の生成AI呼び出しへ接続する方式である。

整理すると次の違いがある。

- handoff 型
  - `spec` や `workbook` を画面に返す
  - 人手または上位エージェントが次の AI に渡す
  - MVP の現行設計
- agent-to-agent 型
  - skill 出力を内部的に次の AI 呼び出しへ渡す
  - 画面には中間 spec や handoff 文を必ずしも出さない
  - skill 単体ではなく、実行基盤またはオーケストレーション設計が必要

MVP では後者までは扱わない。
まずは構造化 I/O と state 持ち回りを安定させることを優先する。

## agent-to-agent 型へ進める場合の拡張方針

将来 agent-to-agent 型へ進める場合は、skill 本体だけで完結させるより、
上位の実行基盤またはオーケストレータで吸収する方が整合的である。

理由:

- 現在の skill は構造化 I/O と format 変換に責務を絞っている
- 外部生成AIの呼び出しを skill 自体に埋め込むと、モデル依存や認証、失敗時制御まで抱え込む
- `spec` / `draft` / `patch` / `workbook` の境界が崩れやすい

### 推奨アーキテクチャ

役割は次のように分ける。

- `mikuproject` skill
  - `spec` を返す
  - `project_draft_view` を `mikuproject_workbook_json` に変換する
  - `Patch JSON` を base state に適用する
  - workbook / xml / xlsx / report を入出力する
- オーケストレータ
  - 利用者要求を受ける
  - `spec` の返却内容を次の生成AIに内部連携する
  - 返ってきた `project_draft_view` や `Patch JSON` を再度 skill に渡す
  - 途中状態として `mikuproject_workbook_json` を保持する
- 別の生成AI
  - `project_draft_view` を生成する
  - `Patch JSON` を生成する

### 最小の内部連携シーケンス

新規草案では次の流れを想定する。

1. 利用者が要件を入力する
2. オーケストレータが `mikuproject` skill の `spec` を呼ぶ
3. オーケストレータが `spec` と利用者要件を別の生成AIへ渡す
4. 生成AI が `project_draft_view` を返す
5. オーケストレータがその結果を skill の `draft` に渡す
6. skill が `mikuproject_workbook_json` を返す
7. オーケストレータがその workbook state を次ターン用 state として保持する

既存 WBS の修正では次の流れを想定する。

1. オーケストレータが現在の `mikuproject_workbook_json` を保持している
2. オーケストレータが workbook と変更要求を別の生成AIへ渡す
3. 生成AI が `Patch JSON` を返す
4. オーケストレータがその結果を skill の `patch` に渡す
5. skill が更新後の `mikuproject_workbook_json` を返す
6. オーケストレータが更新後 state を保持する

### 必要な基盤機能

agent-to-agent 型にするには、少なくとも次の基盤機能が必要になる。

- skill 呼び出し結果を画面表示せず次段へ内部連携する制御
- どの返却値を次の生成AIへ渡すかを決めるルーティング
- `mikuproject_workbook_json` の会話境界 state 保存
- 失敗時の再試行または中断制御
- 生成AI の応答 kind 判定失敗時に `draft` / `patch` / `workbook` のどこへ戻すかの制御

### 画面表示を抑えるための考え方

`spec` の本文や handoff 文を画面にそのまま出したくない場合、
skill 側で spec を返さなくするのではなく、
オーケストレータ側で「中間出力」として扱うのが自然である。

つまり:

- skill の返却は維持する
- その返却を UI へ出すか、次段の AI に回すかを基盤側で決める

この方が handoff 型と agent-to-agent 型の両方を同じ skill 定義で支えやすい。

### 非推奨の進め方

次の方向は、現時点では非推奨とする。

- `spec` operation の中で直接外部生成AIを呼ぶ
- skill の責務として API key 管理やモデル選択を持たせる
- `draft` / `patch` の kind 判定と外部 LLM 再呼び出しを一体化する

これらは skill の責務を広げすぎ、再利用性と可観測性を落としやすい。

### 将来の追加候補

将来拡張としては次が考えられる。

- `spec` の返却を `display` 用と `handoff` 用に分けるメタデータ
- `draft` / `patch` の処理結果に次の推奨 action を添える
- orchestrated run 用のサンプルフロー文書
- 中間 state を workbook JSON で保存する runner 実装

## エラー方針

### hard error

- JSON として parse できない
- `view_type` / `format` / `operations` から kind を判定できない
- `Patch JSON` なのに base 状態がない
- `project_draft_view` / workbook JSON の必須項目が不足している

### soft error

- upstream の validation check が warning を返した
- Patch の一部 operation が無視された
- workbook JSON の未知列や未知 sheet が無視された

soft error の場合は処理継続し、warning を返す。

## 人手が必要な境界

MVP では次は人手または別会話に委ねる。

- 生成AIへ実際に prompt を渡す作業
- `mikuproject` ブラウザ UI 上での目視確認
- WBS 内容の業務妥当性判断
- SVG / XLSX / Markdown の出力活用

## やさしい説明

ここまでの話を、難しい言葉を使わずに言い換える。

### 今の動き

今の `mikuproject` skill は、次のように動く。

1. `spec` を実行する
2. skill が「次の AI に渡すための説明文」を返す
3. その説明文が画面に表示される
4. その先は、人が別の AI に渡す

つまり今は、
「skill が別の AI と自動で会話する」のではなく、
「skill が次に渡す文章を出す」方式である。

### いま困っている点

あなたが気にしているのはここである。

- `spec` の結果が画面に見えてしまう
- 本当は、その結果を画面に出さずに、次の AI に自動で渡してほしい

これは自然な要望である。
ただし、今の MVP はそこまでは作っていない。

### 何が足りないか

足りないのは `mikuproject` skill 本体ではなく、
「skill の結果を受け取って、次の AI に自動で渡す仕組み」である。

この文書ではそれをオーケストレータと呼んでいたが、
ここでは単に「つなぎ役」と呼ぶ。

### つなぎ役がやること

つなぎ役は、次の順で動く。

1. 利用者の依頼を受ける
2. `mikuproject` skill から `spec` を受け取る
3. その内容を画面に出さず、次の AI に渡す
4. 次の AI から返ってきた `project_draft_view` や `Patch JSON` を受け取る
5. それをまた `mikuproject` skill に渡す
6. 更新後の workbook state を保持する

### つまり何を作ればよいか

次に必要なのは、`mikuproject` skill の大改造ではない。
まず必要なのは次の仕組みである。

- skill の返り値を画面表示せず受け取る
- その返り値を別の AI にそのまま渡す
- 返ってきた JSON をもう一度 skill に戻す
- `mikuproject_workbook_json` を途中状態として持ち回る

### 先に決めるべきこと

実装前に決めるべき点は少ない。

1. どの AI に `spec` や workbook を渡すか
2. 中間の返り値を画面に見せるか見せないか
3. workbook state をどこに保持するか

### いまの結論

結論は次のとおり。

- 今の挙動は不具合ではない
- ただし、理想形には足りない
- 足りないのは skill よりも「つなぎ役」
- 次に進めるなら、その「つなぎ役」の要件を書き出すのがよい

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
