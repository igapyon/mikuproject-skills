# Mikuproject Skill Installation

この文書は、配布された `skill-bundle.zip` をインストール先の環境で使えるようにする手順です。

開発元リポジトリでの build 手順ではなく、受け取った bundle をどう配置するかに絞って説明します。

## 対象

この手順は、次のような人向けです。

- `skill-bundle.zip` を受け取った
- インストール先の環境で `mikuproject` skill を使いたい
- 配布元リポジトリの `npm run build` は実行しない

## 配布物

受け取る想定の配布物は次です。

- `skill-bundle.zip`

展開すると、次のような構成になります。

```text
skill-bundle/
  skills/
    mikuproject/
      _bundled/
        vendor/
          mikuproject/
  README.md
```

## 先に結論

やることは単純です。

1. `skill-bundle.zip` を展開する
2. 展開してできた `skill-bundle/` の中身を skill home の直下へコピーする
3. 実行環境を再起動または再読込する
4. 利用可能 skill 一覧に `mikuproject` が出ることを確認する

コピー後の想定構成は次です。

```text
<skill-home>/
  skills/
    mikuproject/
      _bundled/
        vendor/
          mikuproject/
```

## 手順

### 1. `skill-bundle.zip` を展開する

まず、受け取った `skill-bundle.zip` を任意の作業用フォルダに展開します。

展開後は `skill-bundle/` ディレクトリが見えるはずです。

### 2. skill home を確認する

`mikuproject` skill は、bundle 版では `skills/mikuproject` の中に必要な upstream 実装を同梱しています。

必要なのは次です。

- `skills/mikuproject`
- `skills/mikuproject/_bundled/vendor/mikuproject`

最終的な構成は次です。

```text
<skill-home>/
  skills/
    mikuproject/
      _bundled/
        vendor/
          mikuproject/
```

この文書では、この `<skill-home>` をインストール先の配置ルートと呼びます。

### 3. `skill-bundle/` の中身を skill home へコピーする

展開した `skill-bundle/` の中身を、そのまま skill home 直下へコピーします。

重要なのは次です。

- `skill-bundle/skills/mikuproject` を `<skill-home>/skills/mikuproject` に入れる
- `skills/mikuproject` 配下の `_bundled/vendor/mikuproject` も一緒に入ることを保つ

この bundle では、`skill-bundle/` の中身をそのまま `<skill-home>/` へコピーすれば足ります。

### 4. 実行環境を再起動または再読込する

skill 一覧は起動時に読まれることがあります。

そのため、コピー後は次のどちらかを行います。

- 実行環境を再起動する
- skill 一覧を再読込できる場合は再読込する

### 5. `mikuproject` が利用可能 skill に出ることを確認する

利用可能 skill 一覧に `mikuproject` が出れば、インストール自体は完了です。

ここで `mikuproject` が出ない場合は、まず次を確認します。

- コピー先が skill home 直下になっているか
- `skills/mikuproject/_bundled/vendor/mikuproject` があるか
- 実行環境を再起動または再読込したか

## よくある間違い

### `skills/mikuproject` の一部だけをコピーする

これは不足です。

`mikuproject` skill は bundled upstream も参照します。
`skills/mikuproject` の中身を欠いた状態では、`spec` や import/export 系で不足する可能性があります。

### `_bundled/vendor/mikuproject` を落としてしまう

これは不足です。

今回の bundle 配布では、`vendor/mikuproject` は `skills/mikuproject/_bundled/vendor/mikuproject` に同梱されています。
この bundled 部分を落とすと、実装本体が見つからず fallback に落ちる可能性があります。

### `skill-bundle/` ディレクトリごと入れてしまう

必要なのは `skill-bundle/` そのものではなく、その中身です。

正しい配置:

```text
<skill-home>/
  skills/
    mikuproject/
      _bundled/
        vendor/
          mikuproject/
```

避けたい配置:

```text
<skill-home>/
  skill-bundle/
    skills/
```

## インストール後の最初の試し方

インストールできたら、まずは通常の依頼文で試します。

例:

```text
れでえいやあでWBSつくって
```

望ましい動作は次です。

- エージェントが内部で `mikuproject` を使う
- 中間の `spec` や `project_draft_view` をそのまま画面に出さない
- WBS 要約や結果だけを返す

ただし実行環境によっては fallback があり、次が画面に出ることがあります。

- `spec`
- `project_draft_view`
- `Patch JSON`
- `mikuproject_workbook_json`

その場合でもインストール失敗とは限りません。
まずは `mikuproject` が認識されているかと、処理自体が進むかを確認してください。

## まだ未対応のもの

- `report` 系 CLI

## 関連文書

- 使い始め: [quickstart.md](./quickstart.md)
- 設計メモ: [agent-skill-design.md](./agent-skill-design.md)
