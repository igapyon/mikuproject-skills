# mikuproject-skills

## English

`mikuproject-skills` is an Agent Skills project designed around the open
Agent Skills standard published by Anthropic on December 18, 2025.

This repository reuses the full [`mikuproject`](./vendor/mikuproject)
repository via `git subtree` and builds AI-agent-facing skills on top of
the vendored upstream implementation.

The initial skill scaffold for this repository is available at
[`skills/mikuproject`](./skills/mikuproject).

## MVP

The current MVP focuses on one skill, [`skills/mikuproject`](./skills/mikuproject).

This MVP covers four operations:

- `spec`: provide `mikuproject-ai-json-spec`
- `draft`: accept AI-produced `project_draft_view`
- `patch`: accept AI-produced `Patch JSON`
- `workbook`: hand off `mikuproject_workbook_json`

At the conversation boundary, the MVP passes state around as
`mikuproject_workbook_json`.
It does not try to replace the `mikuproject` browser UI.

Developer-oriented documents are available under [`docs/`](./docs/):

- [`docs/agent-skill-design.md`](./docs/agent-skill-design.md)
- [`docs/upstream-survey.md`](./docs/upstream-survey.md)
- [`docs/development.md`](./docs/development.md)

---

## 日本語

`mikuproject-skills` は、Anthropic が 2025年12月18日に open standard として
公開した Agent Skills の考え方に沿って構成するプロジェクトです。

このリポジトリは [`mikuproject`](./vendor/mikuproject) 全体を `git subtree` で
取り込み、その vendored upstream 実装の上に AI エージェント向け skill を
構築します。

このリポジトリにおける初期 skill 雛形は
[`skills/mikuproject`](./skills/mikuproject) にあります。

### MVP

現在の MVP は 1 つの skill、[`skills/mikuproject`](./skills/mikuproject) に
焦点を当てています。

この MVP は次の 4 操作を対象にします。

- `spec`: `mikuproject-ai-json-spec` を提示する
- `draft`: 生成AIが返した `project_draft_view` を受け取る
- `patch`: 生成AIが返した `Patch JSON` を受け取る
- `workbook`: `mikuproject_workbook_json` を引き渡す

会話境界では、MVP は state を `mikuproject_workbook_json` として持ち回ります。
`mikuproject` のブラウザ UI を置き換えることは目指しません。

開発者向け文書は [`docs/`](./docs/) にあります。

## How To Use

### English

1. Install dependencies with `npm install`.
2. Verify the repository state with `npm test`.
3. Open the skill at [`skills/mikuproject`](./skills/mikuproject).
4. Start with the `spec` flow and hand `mikuproject-ai-json-spec` to another AI.
5. Receive `project_draft_view` and convert it into `mikuproject_workbook_json`.
6. Pass the workbook JSON to another AI and request `Patch JSON`.
7. Apply the patch and continue the loop while carrying state as `mikuproject_workbook_json`.

Notes:

- This skill does not replace the `mikuproject` browser UI.
- For the MVP, state is passed around as `mikuproject_workbook_json` at the conversation boundary.

---

### 日本語

1. `npm install` で依存関係をインストールします。
2. `npm test` でリポジトリの状態を確認します。
3. [`skills/mikuproject`](./skills/mikuproject) の skill を参照します。
4. まず `spec` の流れで `mikuproject-ai-json-spec` を別の生成AIへ渡します。
5. 返ってきた `project_draft_view` を `mikuproject_workbook_json` に変換します。
6. その workbook JSON を別の生成AIへ渡し、`Patch JSON` を依頼します。
7. 返ってきた patch を適用し、`mikuproject_workbook_json` を state として持ち回りながら往復を続けます。

補足:

- この skill は `mikuproject` のブラウザ UI を置き換えるものではありません。
- MVP では、会話境界の state は `mikuproject_workbook_json` として扱います。
