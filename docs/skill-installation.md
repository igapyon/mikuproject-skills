# Mikuproject Skill Installation

この文書は、`skills/mikuproject` を開発中のリポジトリ配置から、Codex が利用可能な skill として認識する配置へ持っていく手順を整理したものです。

## 先に結論

- このリポジトリ内の開発用配置: `skills/mikuproject`
- Codex の利用可能 skill 配置先: `$CODEX_HOME/skills/mikuproject`
- `skills/` だけのコピーでは不足しやすい
- 最短手順は、この `mikuproject-skills` リポジトリ全体を workspace に置いて開くこと
- `.codex/skills` と workspace 側 `vendor/` は役割が違う

このセッションでは `CODEX_HOME` 環境変数は未設定でした。
ただし、組み込み skill の実体が `/Users/igapyon/.codex/skills/.system/...` にあるため、実運用上の候補は `/Users/igapyon/.codex/skills/mikuproject` です。

## 前提

- 開発元の skill は [`skills/mikuproject`](../skills/mikuproject) にある
- `mikuproject` skill は [`vendor/mikuproject`](../vendor/mikuproject) にある upstream 実装や文書も参照する
- 利用可能 skill の自動検出は、リポジトリ内の `skills/` をそのまま見るとは限らない
- `.github/` は、この環境では skill の正規配置先として確認できていない

## 配置の考え方

Codex での skill 利用は、次の2層で考えます。

- `.codex/skills/mikuproject`
  Codex に skill を認識させるための配置
- `<workspace>/vendor/mikuproject`
  skill 実行時に参照される upstream 実装と文書の配置

これは用途が違います。
`skills` を `.codex` 配下へコピーしても、`vendor/mikuproject` が workspace 側に無ければ、`spec` や import/export 系で不足する可能性があります。

## 推奨配置

最も安全なのは、リポジトリ全体を workspace に置く形です。

```text
<workspace>/mikuproject-skills/
  skills/
    mikuproject/
  vendor/
    mikuproject/
```

そのうえで、必要なら skill を Codex 用に次へも配置します。

```text
~/.codex/
  skills/
    mikuproject/
```

## 最低限の構成

workspace に最低限必要なのは次です。

```text
<workspace>/
  vendor/
    mikuproject/
```

Codex 側の認識用には次が必要です。

```text
~/.codex/
  skills/
    mikuproject/
```

つまり、次のように分担します。

- `.codex/skills/mikuproject`
  登録用
- `<workspace>/vendor/mikuproject`
  実行時参照用

## 手順

1. まず workspace を揃える

推奨:

- `mikuproject-skills` リポジトリ全体を workspace に置いて開く

最低限必要:

- `skills/mikuproject`
- `vendor/mikuproject`

`skills/` だけをコピーした構成では、`spec` や import/export 系の処理で参照先が欠ける可能性があります。

2. 依存関係を入れる

```bash
npm install
```

3. リポジトリのテストを通す

```bash
npm test
```

4. 配置先ディレクトリを確認する

`CODEX_HOME` が設定されているなら、その配下の `skills/` を使います。

```bash
printf '%s\n' "$CODEX_HOME"
```

5. `CODEX_HOME` が未設定なら、実体候補を確認する

この環境では `/Users/igapyon/.codex` が候補です。
したがって配置先候補は次です。

```text
/Users/igapyon/.codex/skills/mikuproject
```

6. `skills/mikuproject` を配置先へコピーまたは同期する

例:

```bash
mkdir -p /Users/igapyon/.codex/skills
cp -R skills/mikuproject /Users/igapyon/.codex/skills/mikuproject
```

既に配置済みで更新だけしたいなら、上書きコピーではなく同期方法を決めて運用します。

7. Codex 側で skill 一覧に出ることを確認する

この会話のように `Available skills` に `mikuproject` が出れば、登録済み skill として扱われます。

## 運用上の整理

- `skills/mikuproject`
  このリポジトリで編集・レビュー・テストする開発元
- `$CODEX_HOME/skills/mikuproject`
  Codex に認識させるための利用側配置
- `vendor/mikuproject`
  skill が参照する upstream 実装と canonical 文書

この2つは役割が違います。
「repo にあること」と「このセッションで利用可能 skill として認識されること」は別です。
さらに、`skills/` だけを別 workspace に持っていっても、参照先の `vendor/mikuproject` が無ければ不完全です。
また、`vendor/mikuproject` は通常 `.codex` 配下ではなく、skill を使う workspace 側に置く前提で考えます。

## 利用フロー

skill が利用可能になったら、MVP の基本フローは次です。

1. `spec` で `mikuproject-ai-json-spec` を取得する
2. その spec を AI に渡して `project_draft_view` を生成させる
3. `draft` で `project_draft_view` を取り込み、`mikuproject_workbook_json` にする
4. `workbook` で現在の workbook state を次の AI へ渡す
5. AI から `Patch JSON` を受け取る
6. `patch` で既存 workbook state に反映する
7. 更新後の `mikuproject_workbook_json` を次ターンへ持ち回る

## 注意

- `Patch JSON` は単独では適用できない
- base state として既存の `mikuproject_workbook_json` が必要
- この skill は `mikuproject` のブラウザ UI を置き換えるものではない
- MVP では会話境界の state は `mikuproject_workbook_json` を使う
