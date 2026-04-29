# TODO

`mikuproject-skills` の MVP を実装するための作業分解です。

## 1. MVP 仕様の明文化

- [x] MVP の対象機能を 4 点に固定する
- [x] 各機能の責務を文章で定義する
- [x] MVP の対象外を明記する
- [x] 利用者向けの想定ユースケースを整理する

対象機能:

- [x] `mikuproject-ai-json-spec` の提供
- [x] `project_draft_view` の受け取りと処理
- [x] `Patch JSON` の受け取りと処理
- [x] `mikuproject_workbook_json` の生成と引き渡し

## 2. upstream 調査

- [x] runtime artifact から `mikuproject-ai-json-spec` を取得できることを確認する
- [x] `project_draft_view` の入力仕様を確認する
- [x] `Patch JSON` の入力仕様を確認する
- [x] `mikuproject_workbook_json` の出力仕様を確認する
- [x] ブラウザ UI 以外で再利用可能な処理の位置を確認する
- [x] upstream の stable spec retrieval path を取り込む
- [x] upstream の Java / Node.js runtime artifact を取り込む

## 3. Agent Skill 設計

- [x] Skill の名称と配置方針を決める
- [x] Skill が受け取る入力の形式を定義する
- [x] Skill が返す出力の形式を定義する
- [x] `spec` / `draft` / `patch` / `workbook` の操作単位を定義する
- [x] エラー時の扱いを定義する
- [x] 手作業が必要な境界を定義する

## 4. Skill 雛形の作成

- [x] Skill ディレクトリを作成する
- [x] `SKILL.md` の初版を作成する
- [x] 必要なら補助ファイルを配置する
- [x] README または利用メモから Skill への導線を用意する

## 5. `spec` 提供機能

- [x] `mikuproject-ai-json-spec` を参照または抽出する方法を決める
- [x] Skill から利用者へ提示する手順を記述する
- [x] 生成AIへ渡す最小プロンプト例を用意する

前提:

- `skills/mikuproject/runtime/mikuproject.mjs ai spec` で spec を取得できる
- `java -jar skills/mikuproject/runtime/mikuproject.jar ai spec` で spec を取得できる

## 6. `project_draft_view` 取込機能

- [x] 受け取り方法を定義する
- [x] JSON の最低限の妥当性確認方針を決める
- [x] `mikuproject` へ取り込む手順を記述する
- [x] 取込結果の確認方法を記述する

前提:

- `skills/mikuproject/runtime/mikuproject.mjs state from-draft` で扱える

## 7. `Patch JSON` 取込機能

- [x] 受け取り方法を定義する
- [x] Patch の最低限の妥当性確認方針を決める
- [x] `mikuproject` へ反映する手順を記述する
- [x] 反映後の確認方法を記述する

前提:

- `skills/mikuproject/runtime/mikuproject.mjs ai validate-patch` で検証できる
- `skills/mikuproject/runtime/mikuproject.mjs state apply-patch` で適用できる
- Patch 適用時は base workbook state が必要

## 8. `mikuproject_workbook_json` 引き渡し機能

- [x] 現在の WBS 状態から `mikuproject_workbook_json` を取得する方法を決める
- [x] 生成AIへ渡すときの定型プロンプトを決める
- [x] 差分修正依頼につながる会話例を用意する

前提:

- `skills/mikuproject/runtime/mikuproject.mjs export workbook-json` が使える

## 9. 動作確認

- [x] `spec` 提供の動作確認を行う
- [x] `project_draft_view` 取込の動作確認を行う
- [x] `Patch JSON` 取込の動作確認を行う
- [x] `mikuproject_workbook_json` 引き渡しの動作確認を行う
- [x] MVP の往復シナリオを一連で確認する

検証メモ:

- root の `vitest` を有効化した
- `tests/mikuproject-core-api-smoke.test.js` を追加した
- 2026-04-25: smoke test を `skills/mikuproject/runtime/mikuproject.jar` / `mikuproject.mjs` の CLI contract 検証へ移行した
- `npm test` で 24 files / 208 tests passed を確認した
- 2026-04-14: bundle を repo 外の孤立ディレクトリへコピーして `mikuproject-cli.mjs --help` を実行すると `jsdom` 解決失敗で落ちる問題を確認した
- 2026-04-25: `scripts/build-skill-bundle.mjs` を修正し、`skills/mikuproject/runtime/mikuproject.jar` と `mikuproject.mjs` を同梱するようにした
- 2026-04-14: `tests/mikuproject-bundle-smoke.test.js` を追加し、bundle を一時ディレクトリへ展開した孤立環境でも CLI が起動することを回帰確認に入れた
- 2026-04-25: `docs/skill-installation.md` に bundle の必須構成として `skills/mikuproject/runtime/mikuproject.jar` と `mikuproject.mjs` を追記した
- 2026-04-14: `npm test` で 3 files / 3 tests passed を確認し、`npm run build:bundle:zip` で `bundle/mikuproject-skills-20260413.zip` を再生成した
- 2026-04-29: `workplace/mikuproject-mcp-devel` で `npm install` 後に `npm run build && npm run test` を実行し、27 tests passed を確認した
- 2026-04-29: root の `npm test` で 3 files / 3 tests passed を確認した

## 10. 文書化

- [x] README に MVP の説明を追記する
- [x] README と開発文書に runtime artifact 前提の運用を書き分ける
- [x] Skill の使い方を短くまとめる
- [x] 今後の拡張候補を別枠で整理する

## Cross-Cutting Note

- [x] `mikuproject-skills` 側だけで無理に実装せず、upstream (`mikuproject`) 側の API 追加や公開面整理が妥当な場合は、その都度 `mikuproject` 側アクション候補として相談する

### upstream `mikuproject-java`: completed

現時点で、Agent Skills から Java runtime を優先利用するための主要 CLI surface は揃った。

- [x] upstream の Java CLI runtime artifact と Node.js CLI runtime artifact に `--version` を追加してもらう
  - `mikuproject.jar` / `mikuproject.mjs` はファイル名に version が含まれないため、受け取った artifact の由来や新旧を CLI から判別できる必要がある
- [x] upstream `mikuproject-java` 側で、Node.js runtime の agent-friendly な CLI 引数体系に合わせて Java CLI 引数を変更してもらう
  - `mikuproject-skills` 側の実装項目ではなく、`mikuproject-java` 側メンバーへの TODO として扱う
  - 依頼文書: `docs/upstream-mikuproject-java-cli-request.md`
  - grouped command / named option / workbook JSON 中心の CLI surface に移行済み
- [x] upstream `mikuproject-java` 側で、Java CLI 引数変更時に `output.xlsxbin` のような分かりにくい拡張子をユーザー向け例示から消してもらう
  - public help では `.xlsx` の自然な拡張子を使う形に整理済み
- [x] upstream `mikuproject-java` 側で、ASIS 対応表に `Not available as a direct Java command` と記録した操作の Java 実装を追加してもらう
  - `state summarize` 相当の直接コマンドを追加済み
  - `state diff` 相当の直接コマンドを追加済み
  - agent-friendly Java CLI では、Node.js runtime と同様に workbook JSON を入力として扱える形が望ましい
- [x] upstream `mikuproject-java` 側で、Node.js runtime の `ai export bundle` 相当を追加してもらう
  - 依頼文書: `docs/upstream-mikuproject-java-ai-export-bundle-request.md`
  - Java runtime 優先でも `ai_projection_bundle` を取得できるようになった
  - project overview / phase detail full / task edit full をまとめた JSON contract を Node.js runtime と揃えた

### upstream `mikuproject`: optional parity backlog

以下は Java runtime 側が先に持っている direct command を Node.js runtime 側にも揃えるかどうかの検討項目。
現状の Agent Skills 運用では Java runtime を優先できるため、直ちに blocker ではない。

- [ ] upstream `mikuproject` 側で、ASIS 対応表に `Not available as a direct Node.js command` と記録した操作の Node.js 実装を追加してもらう
  - workbook JSON の validate / replace import / merge import に相当する直接コマンドを追加する
  - XML validate に相当する直接コマンドを追加する
  - 構造 workbook `XLSX` の validate / replace import / merge import に相当する直接コマンドを追加する
  - report directory export に相当する直接コマンドを追加するか、Node.js runtime では bundle ZIP を正とする方針を明記する
  - Node.js runtime 側では、既存の `--in` / `--out` / `--state` 形式と workbook JSON 中心の会話 state を維持する

## 11. 将来拡張の候補

### Phase B: Primary File Import/Export Workflow

- [x] `MS Project XML` の import 支援
- [x] `MS Project XML` の export 支援
- [x] `XLSX` の import 支援
- [x] `XLSX` の export 支援
- [x] `mikuproject_workbook_json` の import 支援
- [x] `mikuproject_workbook_json` の export 支援

対象:

- [x] `MS Project XML`
- [x] `XLSX`
- [x] `mikuproject_workbook_json`

対象外:

- [ ] `CSV`
- [ ] AI 向け編集用 JSON 群
  - `project_overview_view`
  - `phase_detail_view`
  - `task_edit_view`
  - `full bundle`

設計メモ:

- [x] `docs/file-import-export.md` に主要ファイル形式の import / export を統合して整理する
- [x] `skills/mikuproject/SKILL.md` に Phase B の操作を反映する
- [x] `skills/mikuproject/references/` に `xml/xlsx/workbook` の短い利用例を追加する

### Phase C: Report / Presentation Outputs

- [x] `WBS XLSX` 出力支援
- [x] `SVG` 出力各種の支援
- [x] `Markdown` 出力支援
- [x] `Mermaid` 出力支援

設計メモ:

- [x] `docs/report-export.md` に report / presentation 出力を統合して整理する

検証メモ:

- 2026-04-29: `tests/mikuproject-phase-c-smoke.test.js` を追加し、Node.js / Java runtime の両方で `report wbs-xlsx`、`daily-svg`、`weekly-svg`、`monthly-calendar-svg`、`wbs-markdown`、`mermaid`、`all` の生成を確認するようにした

### Other Future Candidates

- [x] WBS レビュー支援
- [x] スケジュール圧縮や分解の助言
- [x] 複数プロンプトテンプレートの整備

検証メモ:

- 2026-04-29: `skills/mikuproject/references/workflow/schedule-adjustment.md` を追加し、schedule compression / task split / review-to-patch flow を整理した
- 2026-04-29: `tests/mikuproject-schedule-adjustment-reference.test.js` を追加し、schedule adjustment workflow の導線、Patch 操作、境界を確認するようにした
- 2026-04-29: `skills/mikuproject/references/workflow/wbs-review.md` を追加し、projection 優先の WBS review と review-to-patch flow を整理した
- 2026-04-29: `tests/mikuproject-wbs-review-reference.test.js` を追加し、WBS review workflow の導線と境界を確認するようにした
- 2026-04-29: `skills/mikuproject/references/prompts/` に new WBS draft、existing WBS review、schedule compression、patch request の短いテンプレートを追加した
- 2026-04-29: `tests/mikuproject-prompt-references.test.js` を追加し、prompt reference の存在、INDEX 導線、必須語彙を確認するようにした

## 12. Execution Backend Policy

`mikuproject-skills` は、既定では成熟している同梱 CLI backend をやや優先する。
ただし、この既定値は環境ポリシーより下位であり、CLI 実行が禁止される環境では
MCP backend を使えるようにする。

目的:

- CLI を追加できるが MCP server / adapter process を許可しない現場を維持する
- CLI 実行を許可しないが承認済み MCP server を使える現場に対応する
- Agent Skill の workflow 知識を保ち、実行面だけを backend として差し替えられるようにする
- backend の自動 fallback が現場ポリシー違反にならないよう、strict policy を扱えるようにする

### Backend policy values

- [x] `cli-only`: 同梱 CLI backend だけを使い、MCP へ自動 fallback しない
- [x] `cli-preferred`: まず同梱 CLI backend を使い、許可されている場合だけ MCP へ fallback する
- [x] `mcp-only`: MCP backend だけを使い、CLI へ自動 fallback しない
- [x] `mcp-preferred`: まず MCP backend を使い、許可されている場合だけ CLI へ fallback する
- [x] `handoff-only`: backend 実行を行わず、spec / JSON / 手順を visible handoff として返す

既定値:

- [x] 明示 policy がない場合の既定を `cli-preferred` として文書化する
- [x] `*-only` policy では別 backend に逃げないことを明記する
- [x] `*-preferred` policy の場合だけ fallback できることを明記する
- [x] ユーザー指示、環境設定、repo 設定、チーム運用ルールの順序関係を整理する

### Agent Skill documentation updates

- [x] `docs/miku-soft-40-agentskills-design-v20260429.md` に execution backend policy を反映する
  - Agent Skill が workflow layer として残り、実行面は CLI backend / MCP backend / handoff backend を選べることを追記する
  - 既定は `cli-preferred` だが、環境 policy が上位であることを明記する
  - `cli-only` / `mcp-only` の strict policy では別 backend へ自動 fallback しないことを明記する
  - MCP backend は `miku-soft-50` の MCP server layer を利用する形であり、Agent Skill が MCP server の実装責務を持たないことを明記する
- [x] `skills/mikuproject/SKILL.md` の Runtime Discipline を backend policy 前提に更新する
- [x] `skills/mikuproject/references/runtime/operations-map.md` に CLI backend と MCP backend の対応表を追加する
- [x] `skills/mikuproject/references/workflow/active-workflow-rules.md` に backend policy をまたぐ fallback 禁止ルールを追加する
- [x] `docs/agent-skill-design.md` に `Agent Skill over CLI backend` と `Agent Skill over MCP backend` の責務分担を追記する
- [x] `docs/quickstart.md` に `cli-preferred` 既定と `mcp-only` / `cli-only` の使い分けを追記する
- [x] `docs/development.md` に backend policy の保守方針と検証対象を追記する

### MCP backend alignment

- [x] `workplace/mikuproject-mcp-devel` の MCP tool 名と Agent Skill operation 名の対応を確認する
- [x] MCP backend で使う主要 tool を Phase A / Phase B / Phase C に分ける
- [x] MCP backend 利用時の state 境界を `mikuproject_workbook_json`、resource URI、server-managed path の関係で整理する
- [x] MCP backend 利用時に `mikuproject://state/current` などの resource URI をどこまで Agent Skill 文書に出すか決める
- [x] direct CLI の file path 中心の結果と MCP の resource / operationId 中心の結果を同じ artifact role で説明できるようにする

### Implementation candidates

- [x] backend policy を会話上の明示指示として解釈するルールを作る
- [x] backend policy を設定ファイルで固定できるか検討する
- [x] MCP tools が利用可能な環境では、CLI コマンド例だけでなく MCP tool 名も参照できるようにする
- [x] `mcp-only` のときに CLI runtime artifact を探索しないことを明文化する
- [x] `cli-only` のときに MCP tool 探索へ進まないことを明文化する
- [x] fallback した場合は、どの backend からどの backend へ移ったかを concise diagnostics として返す
- [x] skill-local 設定ファイル `skills/mikuproject/config/backend-policy.json` を追加する
- [x] 設定ファイルをユーザー明示指示と実行環境 policy より下位に置くことを文書化する

### Next implementation handoff

次セッションでの推奨順:

1. まず今回の文書同期差分を確認して commit する
2. 設定ファイル固定は、会話上の明示指示ルールが固まってから検討する
3. smoke test は、実際の backend selector 実装または検証可能なルール表現ができてから追加する

現時点の前提:

- Agent Skill は workflow layer として残す
- 既定 policy は `cli-preferred`
- `cli-only` / `mcp-only` / `handoff-only` は strict policy として扱う
- MCP backend の参照 contract は `workplace/mikuproject-mcp-devel` の `mikuproject-mcp`
- MCP tool 名は `mikuproject.ai_spec` のようなドット区切り
- MCP server product / repo / adapter 名は `mikuproject-mcp`
- MCP client configuration の server key は短く `mikuproject` でよい
- custom `outputPath` の成果物には固定 `mikuproject://` resource URI を付けない
- 会話上の明示 policy は exact value (`cli-only` / `cli-preferred` / `mcp-only` / `mcp-preferred` / `handoff-only`) を含む場合に解釈する

検証済み:

- 2026-04-29: `workplace/mikuproject-mcp-devel` で `npm install` 後に `npm run build && npm run test` が通過した
- 2026-04-29: root の `npm test` が通過した
- 2026-04-29: `skills/mikuproject/config/backend-policy.json` を追加し、bundle 同梱と policy contract を `tests/mikuproject-backend-policy-config.test.js` で確認するようにした

`mikuproject-mcp` 側への申し送り:

- 実体 repo が別ディレクトリにあるため、この repo の `workplace/mikuproject-mcp-devel` でのテスト修正は本体には未反映
- issue 候補: `packages/node/src/test/serverSmoke.test.ts` の workspace root assertion が checkout 名 `mikuproject-mcp` 固定になっており、`mikuproject-mcp-devel` では落ちる
- 推奨修正例: `assert.match(workspace.root, /mikuproject-mcp(?:-devel)?\/workplace$/);`

### Tests and smoke checks

- [ ] `cli-only` policy で MCP fallback しないことを smoke test する
- [ ] `mcp-only` policy で CLI fallback しないことを smoke test する
- [ ] `cli-preferred` policy で CLI unavailable 時に MCP へ fallback するケースを smoke test する
- [ ] `mcp-preferred` policy で MCP unavailable 時に CLI へ fallback するケースを smoke test する
- [ ] `handoff-only` policy で backend 実行しないことを smoke test する
- [ ] report export 系でも backend policy が同じルールで適用されることを確認する

### Out of scope for this policy work

- [ ] MCP server 自体を `mikuproject-skills` repo に内包する
- [ ] Agent Skill 側で upstream 変換ロジックを再実装する
- [ ] 外部 AI model 呼び出し、API key 管理、model selection を skill に持たせる
- [ ] backend policy を無視して利便性だけで自動実行経路を切り替える
