# CLI Runner Notes

この文書は、`mikuproject` skill の返り値を別の生成AIへ自動で渡す
CLI runner に必要な最小要件を整理したものです。

ここでは難しい設計用語は避け、まず何を入れて何を返し、
途中で何を持てばよいか、どんなコマンドにするかだけを書く。

## 採用方針

最初の自動連携は CLI runner として作る。

理由:

- 挙動を固定しやすい
- どこで失敗したか切り分けやすい
- テストしやすい
- 中間出力を画面に出すかどうかを制御しやすい

## 目的

次をできるようにする。

- `spec` の結果を画面にそのまま表示せず、別の生成AIへ渡す
- 返ってきた `project_draft_view` を `mikuproject` skill に戻す
- 返ってきた `Patch JSON` を `mikuproject` skill に戻す
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
2. つなぎ役が `mikuproject` skill に `spec` を要求する
3. つなぎ役が `spec` 本文を別の生成AIへ渡す
4. 別の生成AIが `project_draft_view` を返す
5. つなぎ役がその JSON を `mikuproject` skill の `draft` に渡す
6. `mikuproject` skill が `mikuproject_workbook_json` を返す
7. つなぎ役がその workbook を現在状態として保存する

## 最小フロー 2: 既存 WBS の修正

1. つなぎ役は現在の `mikuproject_workbook_json` を持っている
2. 利用者が変更内容を書く
3. つなぎ役が workbook と変更内容を別の生成AIへ渡す
4. 別の生成AIが `Patch JSON` を返す
5. つなぎ役がその JSON を `mikuproject` skill の `patch` に渡す
6. `mikuproject` skill が更新後の `mikuproject_workbook_json` を返す
7. つなぎ役が更新後 workbook を保存する

## 最小フロー 3: 出力だけ欲しいとき

1. つなぎ役は現在の `mikuproject_workbook_json` を持っている
2. 利用者が出力形式を指定する
3. つなぎ役が `mikuproject` skill に export 操作を要求する
4. skill が Mermaid / Markdown / SVG / XLSX を返す
5. つなぎ役がそれを最終結果として表示する

## 最初の CLI コマンド案

最初は次の 3 つでよい。

### 1. 草案作成

役割:

- 要件文から `project_draft_view` を生成させる
- それを workbook state に変換して保存する

入れるもの:

- 要件文ファイル、または要件文文字列

返すもの:

- 保存後の `mikuproject_workbook_json`
- warning の要約

コマンド名候補:

- `npm run runner:draft`
- `node scripts/mikuproject-runner.mjs draft`

### 2. 変更反映

役割:

- 現在の workbook state と変更要求から `Patch JSON` を生成させる
- patch を適用して state を更新する

入れるもの:

- 変更要求文
- 現在の workbook state

返すもの:

- 更新後の `mikuproject_workbook_json`
- change summary
- warning の要約

コマンド名候補:

- `npm run runner:patch`
- `node scripts/mikuproject-runner.mjs patch`

### 3. 出力

役割:

- 現在の workbook state から最終出力を作る

入れるもの:

- 出力種別
  - `mermaid`
  - `wbs-markdown`
  - `daily-svg`
  - `weekly-svg`
  - `monthly-calendar-svg`
  - `wbs-xlsx`

返すもの:

- 指定した形式の出力

コマンド名候補:

- `npm run runner:export`
- `node scripts/mikuproject-runner.mjs export mermaid`

## 画面に出さないもの

CLI runner では、次は通常表示しない方がよい。

- `spec` 本文
- handoff 用補助文
- 途中の `project_draft_view`
- 途中の `Patch JSON`

必要なら `--debug` 時だけ表示する。

## 画面に出すもの

理想形では、次は中間表示しない。

- `spec` 本文
- handoff 用の補助文
- 中間の workbook JSON

代わりに、画面には次だけを出す。

- 処理中であること
- 失敗時の理由
- 最終結果
- 必要なら warning の要約

## 失敗したときの扱い

最低限、次を分けて扱う。

- `project_draft_view` が返らなかった
- `Patch JSON` が返らなかった
- kind 判定に失敗した
- `patch` に必要な base state が無い
- `mikuproject` skill 側で warning または error が返った

## 最初の実装を小さく保つための条件

最初は次だけでよい。

- 新規草案
- 既存修正
- workbook state の保持

最初から不要なもの:

- 複数 AI の比較
- 自動再試行の複雑な制御
- UI 上の細かい可視化
- 高度なローカル編集フロー

## 実装前の確認事項

CLI 採用を前提にすると、実装前に確認したいのは次の 3 点で足りる。

1. 別の生成AIへ渡す呼び出し口を何にするか
2. `mikuproject_workbook_json` をどの state ファイルに保存するか
3. 中間出力を完全非表示にするか、デバッグ時だけ見せるか

## 初期実装の形

最初は 1 ファイルの CLI でよい。

候補:

- `scripts/mikuproject-runner.mjs`

役割:

- 引数を読む
- state ファイルを読む
- `mikuproject` 側の API を呼ぶ
- 別の生成AIを呼ぶ
- 結果を state ファイルへ保存する
- 最終結果だけ表示する

## 結論

`mikuproject` skill 自体は、すでに structured I/O の役割をかなり持っている。
次に必要なのは、その前後をつないで自動で往復させる小さな CLI 実行役である。
