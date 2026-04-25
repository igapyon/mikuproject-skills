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
- `java -jar skills/mikuproject/runtime/mikuproject.jar export-ai-json-spec` で spec を取得できる

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

## 10. 文書化

- [x] README に MVP の説明を追記する
- [x] README と開発文書に runtime artifact 前提の運用を書き分ける
- [x] Skill の使い方を短くまとめる
- [x] 今後の拡張候補を別枠で整理する

## Cross-Cutting Note

- [x] `mikuproject-skills` 側だけで無理に実装せず、upstream (`mikuproject`) 側の API 追加や公開面整理が妥当な場合は、その都度 `mikuproject` 側アクション候補として相談する
- [ ] upstream の Java CLI runtime artifact と Node.js CLI runtime artifact に `--version` を追加してもらう
  - `mikuproject.jar` / `mikuproject.mjs` はファイル名に version が含まれないため、受け取った artifact の由来や新旧を CLI から判別できる必要がある
- [ ] upstream `mikuproject-java` 側で、Node.js runtime の agent-friendly な CLI 引数体系に寄せた Java facade command を追加してもらう
  - `mikuproject-skills` 側の実装項目ではなく、`mikuproject-java` 側メンバーへの TODO として扱う
  - 現状の Java CLI は XML と位置引数を中心にした低レベル command が多く、Node.js CLI は `ai spec`、`state from-draft --in --out`、`state apply-patch --state --in --out`、`report all --in --out` のように生成AIが組み立てやすい
  - 既存 Java command は残しつつ、生成AI向けには Node.js CLI と近い階層・命名・`--in` / `--out` 引数を持つ入口を追加するのが望ましい
- [ ] upstream `mikuproject-java` 側で、agent-friendly Java facade command 追加時に `output.xlsxbin` のような分かりにくい拡張子をユーザー向け例示から消せるか確認してもらう
  - コマンド体系を Node.js runtime 側へ寄せるなら、構造 workbook `XLSX` や report `WBS XLSX` の出力例も `.xlsx` のような自然な拡張子で示せることが期待される
  - 内部実装上の都合で `xlsxbin` 相当の概念が残る場合でも、生成AI向け・利用者向けの facade CLI では露出しない形にできるかを確認する
- [ ] upstream `mikuproject-java` 側で、ASIS 対応表に `Not available as a direct Java command` と記録した操作の Java 実装を追加してもらう
  - 少なくとも `state summarize` 相当の直接コマンドを追加する
  - 少なくとも `state diff` 相当の直接コマンドを追加する
  - agent-friendly Java facade command では、Node.js runtime と同様に workbook JSON を入力として扱える形が望ましい
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

- [ ] `WBS XLSX` 出力支援
- [ ] `SVG` 出力各種の支援
- [ ] `Markdown` 出力支援
- [ ] `Mermaid` 出力支援

設計メモ:

- [x] `docs/report-export.md` に report / presentation 出力を統合して整理する

### Other Future Candidates

- [ ] MCP 対応
- [ ] WBS レビュー支援
- [ ] スケジュール圧縮や分解の助言
- [ ] 複数プロンプトテンプレートの整備
