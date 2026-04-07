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

- [x] `vendor/mikuproject` 内で `mikuproject-ai-json-spec` の所在を確認する
- [x] `project_draft_view` の入力仕様を確認する
- [x] `Patch JSON` の入力仕様を確認する
- [x] `mikuproject_workbook_json` の出力仕様を確認する
- [x] ブラウザ UI 以外で再利用可能な処理の位置を確認する
- [x] upstream の stable spec API を取り込む
- [x] upstream の unified core API を取り込む

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

- `vendor/mikuproject` では `globalThis.__mikuprojectAiJsonSpec.getAiJsonSpecText()` / `getAiJsonSpec()` が使える

## 6. `project_draft_view` 取込機能

- [x] 受け取り方法を定義する
- [x] JSON の最低限の妥当性確認方針を決める
- [x] `mikuproject` へ取り込む手順を記述する
- [x] 取込結果の確認方法を記述する

前提:

- `globalThis.__mikuprojectCoreApi.importAiJsonDocument()` または `importAiJsonText()` で扱える

## 7. `Patch JSON` 取込機能

- [x] 受け取り方法を定義する
- [x] Patch の最低限の妥当性確認方針を決める
- [x] `mikuproject` へ反映する手順を記述する
- [x] 反映後の確認方法を記述する

前提:

- `globalThis.__mikuprojectCoreApi.importAiJsonDocument()` または `importAiJsonText()` で扱える
- Patch 適用時は `baseModel` が必要

## 8. `mikuproject_workbook_json` 引き渡し機能

- [x] 現在の WBS 状態から `mikuproject_workbook_json` を取得する方法を決める
- [x] 生成AIへ渡すときの定型プロンプトを決める
- [x] 差分修正依頼につながる会話例を用意する

前提:

- `globalThis.__mikuprojectCoreApi.workbookJson.exportDocument()` が使える

## 9. 動作確認

- [x] `spec` 提供の動作確認を行う
- [x] `project_draft_view` 取込の動作確認を行う
- [x] `Patch JSON` 取込の動作確認を行う
- [x] `mikuproject_workbook_json` 引き渡しの動作確認を行う
- [x] MVP の往復シナリオを一連で確認する

検証メモ:

- root の `vitest` を有効化した
- `tests/mikuproject-core-api-smoke.test.js` を追加した
- `vendor/mikuproject/tests/**/*.test.js` も root から実行できるようにした
- `npm test` で 24 files / 208 tests passed を確認した

## 10. 文書化

- [x] README に MVP の説明を追記する
- [x] README に `subtree sync` 前提の運用を書き分ける
- [x] Skill の使い方を短くまとめる
- [x] 今後の拡張候補を別枠で整理する

## 11. 将来拡張の候補

### Phase B: Primary File Import/Export Workflow

- [ ] `MS Project XML` の import 支援
- [ ] `MS Project XML` の export 支援
- [ ] `XLSX` の import 支援
- [ ] `XLSX` の export 支援
- [ ] `mikuproject_workbook_json` の import 支援
- [ ] `mikuproject_workbook_json` の export 支援

対象:

- [ ] `MS Project XML`
- [ ] `XLSX`
- [ ] `mikuproject_workbook_json`

対象外:

- [ ] `CSV`
- [ ] AI 向け編集用 JSON 群
  - `project_overview_view`
  - `phase_detail_view`
  - `task_edit_view`
  - `full bundle`

設計メモ:

- [x] `docs/phase-b-primary-file-workflow.md` に初期仕様メモを作成する

### Phase C: Report / Presentation Outputs

- [ ] `WBS XLSX` 出力支援
- [ ] `SVG` 出力各種の支援
- [ ] `Markdown` 出力支援
- [ ] `Mermaid` 出力支援

### Other Future Candidates

- [ ] MCP 対応
- [ ] WBS レビュー支援
- [ ] スケジュール圧縮や分解の助言
- [ ] 複数プロンプトテンプレートの整備
