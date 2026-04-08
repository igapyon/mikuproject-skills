# 実験参加者向け案内

件名: `mikuproject` skill 試用のお願い

`mikuproject` skill の実験版を共有します。  
試用をお願いしたいです。

## 配布物

- `skill-bundle.zip`

## セットアップ

1. `skill-bundle.zip` を展開してください
2. 展開してできた `skill-bundle/` の中身を、あなたの skill home 配下へコピーしてください
3. 環境を再起動または再読込してください
4. 利用可能 skill 一覧に `mikuproject` が出ることを確認してください

展開後の想定構成は次です。

```text
<skill-home>/
  skills/
    mikuproject/
      runtime/
        mikuproject/
```

## いま試せること

- `spec`
- `draft`
- `patch`
- `workbook`

また、内部では `mikuproject` の first cut CLI を前提にしています。

- `mikuproject ai spec`
- `mikuproject state from-draft`
- `mikuproject state apply-patch`
- `mikuproject export workbook-json`
- `mikuproject export xml`
- `mikuproject export xlsx`

## 使い始めの例

まずは次のような依頼から試してください。

- `spec を出して`
- `この project_draft_view を取り込んで`
- `この Patch JSON を反映して`
- `現在の workbook を出して`

## 現時点の前提

望ましい動作は、agent-internal execution です。  
つまり、`spec` や workbook JSON などの中間データは、通常は画面に出さず内部で保持する想定です。

ただし、実行環境によっては fallback として中間出力が画面に表示される場合があります。  
その場合でも試用自体は可能です。

## 未対応

- `report` 系 CLI は未実装です

## 見てほしい点

次の点を確認してもらえると助かります。

- `mikuproject` skill が認識されるか
- `spec` / `draft` / `patch` / `workbook` の流れが進められるか
- 中間出力が内部保持されるか、それとも表示 fallback になるか
- 使いにくい点や詰まる箇所がないか

不具合や気になった点があれば、そのまま共有してください。
