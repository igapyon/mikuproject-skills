# Agent-Internal CLI Notes

この文書は、生成AIエージェントが `mikuproject` CLI を
内部ツールとして使うときの最小要件を整理したものです。

ここでは難しい設計用語は避け、まず何を入れて何を返し、
途中で何を持てばよいかだけを書く。

## 採用方針

最初に目指すのは、外部で別の AI コマンドを呼ぶ runner ではない。
生成AIエージェントが会話の内部で `mikuproject` CLI を呼ぶ形である。
しかも、既定は handoff ではなく agent-internal hidden workflow とする。

理由:

- 利用者から見ると自然である
- `spec` や workbook を画面に見せず内部 state として扱いやすい
- 生成AI が `project_draft_view` や `Patch JSON` を内部で生成できる
- `mikuproject` は変換と export の道具として分離しやすい

この方針は、`mikuproject` 側で first cut の CLI が追加された前提で進める。

現時点で使える `mikuproject` CLI は次である。

- `mikuproject ai spec`
- `mikuproject state from-draft`
- `mikuproject state apply-patch`
- `mikuproject export workbook-json`
- `mikuproject export xml`
- `mikuproject export xlsx`

補足:

- 主成果物は `stdout`
- diagnostics は `stderr`
- `report` 系 CLI は未実装

## 目的

次をできるようにする。

- `spec` の結果を画面にそのまま表示せず、エージェント内部で使う
- エージェントが生成した `project_draft_view` を `mikuproject` に渡す
- エージェントが生成した `Patch JSON` を `mikuproject` に渡す
- 途中状態を `mikuproject_workbook_json` として持ち回る

## この仕組みが受け取るもの

- 利用者の依頼文
- 現在の `mikuproject_workbook_json`
  - 新規作成のときは無くてもよい
- どの操作をしたいか
  - 新規草案
  - 既存 WBS の修正
  - workbook の確認

## この仕組みが返すもの

- 新規草案なら、生成された `mikuproject_workbook_json`
- 修正なら、更新後の `mikuproject_workbook_json`
- 必要に応じて、途中で返ってきた warning
- 必要に応じて、最終出力
  - Mermaid
  - WBS Markdown
  - SVG
  - XLSX

## 保持する状態

最低限、次の 1 つを持てばよい。

- 現在の `mikuproject_workbook_json`

最初の実装では、state はファイルとして保存する前提にする。

理由:

- CLI と相性がよい
- 途中経過を確認しやすい
- セッションをまたいで再利用しやすい

候補:

- `state/current-workbook.json`

理由:

- `draft` の結果を次ターンへ持ち回れる
- `patch` の base state として使える
- 必要なら report export にも使える

## 最小フロー 1: 新規草案

1. 利用者が要件を書く
2. エージェントが `mikuproject ai spec` を呼ぶ
3. エージェントが `spec` を内部で参照しながら `project_draft_view` を生成する
4. エージェントがその JSON を `mikuproject state from-draft` に渡す
5. `mikuproject` CLI が `mikuproject_workbook_json` を返す
6. エージェントがその workbook を現在状態として保存する

## 最小フロー 2: 既存 WBS の修正

1. エージェントは現在の `mikuproject_workbook_json` を持っている
2. 利用者が変更内容を書く
3. エージェントが workbook と変更要求をもとに `Patch JSON` を生成する
4. エージェントがその JSON を `mikuproject state apply-patch` に渡す
6. `mikuproject` CLI が `mikuproject_workbook_json` を返す
5. `mikuproject` CLI が更新後の `mikuproject_workbook_json` を返す
6. エージェントが更新後 workbook を保存する

## 最小フロー 3: 出力だけ欲しいとき

1. エージェントは現在の `mikuproject_workbook_json` を持っている
2. 利用者が出力形式を指定する
3. エージェントが `mikuproject export ...` を呼ぶ
4. `mikuproject` CLI が workbook JSON / XML / XLSX を返す
5. エージェントがそれを最終結果として表示する

## エージェントが内部で使う CLI

最初は次の 6 つでよい。

- `mikuproject ai spec`
- `mikuproject state from-draft`
- `mikuproject state apply-patch`
- `mikuproject export workbook-json`
- `mikuproject export xml`
- `mikuproject export xlsx`

`report` 系は `mikuproject` CLI 側で未実装のため、初期スコープの対象外とする。

## 画面に出さないもの

生成AIエージェント内部では、次は通常表示しない方がよい。

- `spec` 本文
- handoff 用補助文
- 途中の `project_draft_view`
- 途中の `Patch JSON`

## 画面に出すもの

既定では、次は中間表示しない。

- `spec` 本文
- handoff 用の補助文
- 中間の workbook JSON

代わりに、画面には次だけを出す。

- 処理中であること
- 失敗時の理由
- 最終結果
- 必要なら warning の要約

handoff 型は fallback にとどめる。
つまり、`spec` や workbook を画面にそのまま出すのは、ユーザーが明示要求したときか、実行環境が内部保持に対応できないときだけにする。

## 失敗したときの扱い

最低限、次を分けて扱う。

- `project_draft_view` をエージェントが生成できなかった
- `Patch JSON` をエージェントが生成できなかった
- kind 判定に失敗した
- `patch` に必要な base state が無い
- `mikuproject` CLI 側で warning または error が返った

## 最初の実装を小さく保つための条件

最初は次だけでよい。

- 新規草案
- 既存修正
- workbook state の保持

最初から不要なもの:

- 外部 AI コマンド呼び出し
- API key 管理
- 複数 AI の比較
- 自動再試行の複雑な制御
- UI 上の細かい可視化

## 結論

`mikuproject` skill 自体は、すでに structured I/O の役割をかなり持っている。
次に必要なのは、生成AIエージェントが `mikuproject` CLI を
内部で呼びながら state を持ち回る運用である。
