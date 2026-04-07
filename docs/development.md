# Development Notes

この文書は `mikuproject-skills` の開発者向けメモです。

## 文書の場所

- 設計メモ: [agent-skill-design.md](./agent-skill-design.md)
- upstream 調査: [upstream-survey.md](./upstream-survey.md)
- 実装 TODO: [../TODO.md](../TODO.md)

## subtree 運用

`mikuproject` は `vendor/mikuproject/` に `git subtree` で取り込んでいます。

取得:

```bash
git fetch https://github.com/igapyon/mikuproject.git main
```

同期:

```bash
git subtree pull --prefix=vendor/mikuproject https://github.com/igapyon/mikuproject.git main
```

## テスト

root で `vitest` を有効化しています。

```bash
npm install
npm test
```

現状の test 対象:

- `tests/**/*.test.js`
- `vendor/mikuproject/tests/**/*.test.js`

## 現在の MVP の前提

- skill は `skills/mikuproject` にある
- 会話境界の state は `mikuproject_workbook_json`
- upstream の stable API と unified core API を前提にしている
