# mikuproject-skills

## English

`mikuproject-skills` is an Agent Skills project designed around the open
Agent Skills standard published by Anthropic on December 18, 2025.

This repository reuses the full [`mikuproject`](./vendor/mikuproject)
repository via `git subtree` and builds AI-agent-facing skills on top of
the vendored upstream implementation.

For an AI agent, `mikuproject` mainly provides three things:

- a structured way to draft a new WBS
- a structured way to revise an existing WBS
- a way to keep project state and export it into useful formats

In other words, the agent focuses on planning decisions, while `mikuproject`
provides the structure, state, and format conversion around that work.

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
The preferred mode is agent-internal execution that keeps intermediate artifacts off-screen.
If the host runtime cannot do that, the workflow may fall back to handoff-style display.

The repository also now documents a Phase B primary file workflow for
`MS Project XML`, structural workbook `XLSX`, and `mikuproject_workbook_json`.

Developer-oriented documents are available under [`docs/`](./docs/):

- [`docs/quickstart.md`](./docs/quickstart.md)
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

生成AIにとって `mikuproject` が与えるものは、主に次の 3 つです。

- 新規 WBS を草案化するための型
- 既存 WBS を修正するための型
- project の状態を保持し、各形式へ変換するための仕組み

言い換えると、生成AIは計画そのものを考えることに集中し、
`mikuproject` はそのまわりの構造、状態保持、形式変換を受け持ちます。

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
また、望ましい運用は、この skill の中間出力を
上位エージェント内部で隠しながら処理する agent-internal execution です。
実行環境がそれに対応できない場合だけ、handoff 型にフォールバックします。

あわせて、このリポジトリでは `MS Project XML`、構造忠実 workbook `XLSX`、
`mikuproject_workbook_json` を扱う Phase B の primary file workflow も整理しています。

開発者向け文書は [`docs/`](./docs/) にあります。

- [`docs/quickstart.md`](./docs/quickstart.md)
- [`docs/agent-skill-design.md`](./docs/agent-skill-design.md)
- [`docs/upstream-survey.md`](./docs/upstream-survey.md)
- [`docs/development.md`](./docs/development.md)

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
- The preferred mode is to keep intermediate artifacts in agent-internal state and only fall back to handoff-style display when needed.
- `report` CLI commands are not implemented yet.

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
- 望ましい既定は agent-internal execution であり、`spec` や workbook の中間出力は通常は画面に出さず内部保持します。
- 実行環境が対応できない場合だけ、handoff 型として中間出力を表示します。
- `report` 系 CLI はまだ未実装です。
