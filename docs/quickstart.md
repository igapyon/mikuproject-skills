# Quickstart

この文書は、`mikuproject-skills` をいま動く範囲で試すための最短手順です。

対象:

- `spec`
- `draft`
- `patch`
- `workbook`
- `mikuproject` CLI の `workbook-json` / `xml` / `xlsx`

未対応:

- `report` 系 CLI

この時点で向いている相手:

- 開発者
- 評価目的の利用者
- `spec -> draft -> patch -> workbook` の往復を追える利用者

この時点でまだ向いていない相手:

- 実行環境が fallback なしの hidden state をまだ実現できていない利用者

## 先に結論

最短で試すなら、次の条件を満たします。

1. このリポジトリ全体を workspace に置く
2. `bundle/skill-bundle` を作って skill home に展開する
3. `npm install`
4. `npm test`
5. Codex との会話で `mikuproject` skill を使う

## 事前準備

### 1. workspace を揃える

このリポジトリ全体を workspace に置いて開きます。

必要なのは次です。

- `skills/mikuproject`
- `vendor/mikuproject`

`skills/` だけでは不足します。

### 2. bundle を作って配置する

次を実行します。

```bash
npm run build:bundle
```

これで次が作られます。

```text
bundle/skill-bundle/
  skills/
    mikuproject/
      runtime/
        mikuproject/
```

その中身を skill home にコピーします。

zip が欲しい場合は次も使えます。

```bash
npm run build:bundle:zip
```

生成先:

```text
bundle/skill-bundle.zip
```

詳しくは [skill-installation.md](./skill-installation.md) を参照してください。

### 3. 依存関係とテスト

```bash
npm install
npm test
```

ここが通れば、少なくともこのリポジトリ内の前提は揃っています。

配布物までまとめて作るときは次を使えます。

```bash
npm run build
```

これは次をまとめて実行します。

- `npm test`
- `npm run build:bundle`
- `npm run build:bundle:zip`

## まず試す流れ

### 新規草案と既存編集の区別

この skill では、ここを厳密に分けます。

- 新規に WBS を作るとき: `project_draft_view`
- 既存の WBS を直すとき: `Patch JSON`

新規草案の会話で、次へ寄ってはいけません。

- `task_edit_view`
- `phase_detail_view`
- `project_overview_view`

`.editjson` は upstream 側で広い編集用 JSON 群の拡張子として使われることがあります。
`project_draft_view` は JSON 文書であり、`.editjson` として受け渡してかまいません。
ただしこの skill の通常会話では document kind を優先します。
つまり、新規草案では `project_draft_view`、既存編集では `Patch JSON` と呼びます。

### 1. まずはそのまま WBS 作成を依頼する

会話では、まず通常の依頼文で始めます。

```text
れでえいやあでWBSつくって
```

期待すること:

- エージェントが内部で `spec` を参照する
- エージェントが内部で `project_draft_view` を作る
- それを `mikuproject` に内部で取り込み、workbook state まで進める
- ユーザーには WBS 要約や完成結果だけが返る

避けたい挙動:

- `spec` 本文がそのまま画面に出る
- `project_draft_view` の JSON がそのまま画面に出る
- `以下を mikuproject に渡せます` のような visible handoff で止まる
- `task_edit_view` や `.editjson` の説明へ逸れる

このような表示が出る場合は、fallback 動作になっている可能性があります。

### 2. 明示的に spec を見たい場合だけ出す

会話で次のように依頼します。

```text
spec を出して
```

期待すること:

- `mikuproject-ai-json-spec` が返る
- これは通常運用ではなく、raw spec を確認したいときの操作

### 3. すでにある `project_draft_view` を取り込む

外部で作った `project_draft_view` を取り込むときは、次のように依頼します。

```text
この project_draft_view を取り込んで
```

期待すること:

- `mikuproject_workbook_json` が返る

### 4. patch を当てる

現在の workbook state をもとに変更したいときは、通常は変更要求をそのまま伝えます。

```text
このWBSを1週間短くして
```

期待すること:

- エージェントが内部で `Patch JSON` を作る
- それを `mikuproject` に内部で適用する
- ユーザーには更新後の内容だけを返す

外部で作った `Patch JSON` を適用するときは、次のように依頼します。

```text
この Patch JSON を反映して
```

期待すること:

- 更新後の `mikuproject_workbook_json` が返る

### 5. workbook を引き渡す

現在の state をもう一度 AI に渡したいときは、次のように依頼します。

```text
現在の workbook を出して
```

期待すること:

- 現在の `mikuproject_workbook_json` が返る

### 6. Markdown や Mermaid に変換する

export を頼むときは、補助スクリプトを作るのではなく、`mikuproject` の正式 export を使うのが期待動作です。

例:

```text
これを markdown化して
```

```text
これを Mermaid 化して
```

期待すること:

- `markdown化` は `wbs-markdown-export` として扱われる
- `Mermaid 化` は `mermaid-export` として扱われる
- 通常運用では `tmp/*.mjs` のような補助スクリプトを作らない
- 依存不足で export できない場合だけ、その不足を短く報告する

## `mikuproject` CLI でできること

bundle 配布物では `skills/mikuproject/runtime/mikuproject` 側の first cut CLI が使えます。
開発元リポジトリでは `vendor/mikuproject` 側にあります。

```text
mikuproject ai spec
mikuproject state from-draft
mikuproject state apply-patch
mikuproject export workbook-json
mikuproject export xml
mikuproject export xlsx
mikuproject report wbs-xlsx
mikuproject report daily-svg
mikuproject report weekly-svg
mikuproject report monthly-calendar-svg
mikuproject report wbs-markdown
mikuproject report mermaid
```

この CLI は、上位エージェントが内部で使う前提で考えます。

## いまの利用イメージ

望ましい既定は agent-internal execution です。

つまり:

1. `spec` や workbook は通常は画面に出さない
2. エージェントが内部で `project_draft_view` や `Patch JSON` を作る
3. その JSON を `mikuproject` 側に戻す
4. 必要な最終結果だけを画面に出す

実行環境がこれに対応できない場合だけ、handoff 型にフォールバックします。

## つまずきやすい点

- `skills/` だけをコピーしても動かない
- `Patch JSON` は base state なしでは適用できない
- `monthly-calendar-svg` は単一 SVG ではなく ZIP 出力
- `spec` が画面に出る場合は fallback 動作の可能性がある

## 次に見る文書

- 配置手順: [skill-installation.md](./skill-installation.md)
- 設計メモ: [agent-skill-design.md](./agent-skill-design.md)
- agent 内部連携メモ: [agent-to-agent-runner.md](./agent-to-agent-runner.md)
