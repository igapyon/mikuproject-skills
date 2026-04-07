# Upstream Survey

`vendor/mikuproject` を対象に、`mikuproject-skills` の MVP に必要な upstream 実装の所在を整理したメモです。

## 対象 MVP

- `mikuproject-ai-json-spec` の提供
- `project_draft_view` の受け取りと処理
- `Patch JSON` の受け取りと処理
- `mikuproject_workbook_json` の生成と引き渡し

## 調査結果

### 1. `mikuproject-ai-json-spec` の提供

- prompt/spec 本体は `vendor/mikuproject/docs/mikuproject-ai-json-spec.md` にある
- upstream には `vendor/mikuproject/src/ts/ai-json-spec.ts` が追加されている
- `globalThis.__mikuprojectAiJsonSpec.getAiJsonSpecText()` / `getAiJsonSpec()` で安定取得できる

評価:

- Skill 側は markdown ファイル直読みではなく API 経由に寄せられる
- version を含む spec オブジェクト取得も可能

### 2. `project_draft_view` の受け取りと処理

- JSON 種別判定は `vendor/mikuproject/src/ts/ai-json-util.ts`
- upstream の集約入口は `vendor/mikuproject/src/ts/core-api.ts`
- `globalThis.__mikuprojectCoreApi.importAiJsonDocument()` / `importAiJsonText()` で `project_draft_view` を扱える
- `project_draft_view` 単体の本体 import も `vendor/mikuproject/src/ts/msproject-xml.ts` の `importProjectDraftView` として残っている

評価:

- Skill 側は UI 用フローを辿らずに `replace` モードで取り込める
- `ProjectModel` を返す形に統一されていて扱いやすい

### 3. `Patch JSON` の受け取りと処理

- JSON 種別判定は `vendor/mikuproject/src/ts/ai-json-util.ts`
- upstream の集約入口は `vendor/mikuproject/src/ts/core-api.ts`
- `globalThis.__mikuprojectCoreApi.importAiJsonDocument()` / `importAiJsonText()` で `patch_json` を扱える
- Patch 適用本体は `vendor/mikuproject/src/ts/project-patch-json.ts` の `importProjectPatchJson`

評価:

- warning と change summary を維持したまま unified entrypoint から利用できる
- Patch 適用時は `baseModel` が必要、という制約も API 上に明示されている

### 4. `mikuproject_workbook_json` の生成と引き渡し

- export/import 本体は `vendor/mikuproject/src/ts/project-workbook-json.ts`
- upstream の集約入口は `vendor/mikuproject/src/ts/core-api.ts`
- `globalThis.__mikuprojectCoreApi.workbookJson.exportDocument()` / `importAsProjectModel()` / `importIntoProjectModel()` が使える
- `globalThis.__mikuprojectCoreApi.importAiJsonDocument()` / `importAiJsonText()` でも `workbook_json` を扱える

評価:

- workbook JSON を state exchange format として寄せやすい
- replace と merge の両経路を同じ公開面から使える

## まとめ

MVP の4機能について、upstream は次の公開面を持つ状態になった。

- `spec`: `__mikuprojectAiJsonSpec` から安定取得できる
- `project_draft_view`: `__mikuprojectCoreApi.importAiJsonDocument()` で扱える
- `Patch JSON`: `__mikuprojectCoreApi.importAiJsonDocument()` で扱える
- `mikuproject_workbook_json`: `__mikuprojectCoreApi.workbookJson.*` と `__mikuprojectCoreApi.importAiJsonDocument()` で扱える

結論として、`mikuproject-skills` の MVP は upstream の新しい公開 API を前提に組み立てられる。
skills 側で UI 実装都合の分散 API を直接束ねる必要は薄くなった。

## Agent Skills 側の実装含意

- `spec` 提供は `vendor/mikuproject/docs/mikuproject-ai-json-spec.md` の直読みではなく、`__mikuprojectAiJsonSpec` を優先できる
- 新規生成時は `project_draft_view -> __mikuprojectCoreApi.importAiJsonDocument() -> ProjectModel -> workbook_json` の導線を基本形にできる
- 既存編集時は `workbook_json -> ProjectModel -> Patch JSON apply -> workbook_json` を `__mikuprojectCoreApi` 上で構成できる
- JSON fenced block 付き応答も `importAiJsonText()` で受けられる

## 残タスク

- Skill 実装側で `vendor/mikuproject` をどう起動して `globalThis.__mikuprojectAiJsonSpec` / `__mikuprojectCoreApi` を利用可能にするかは要設計
- `ProjectModel` の保持形式を workbook JSON に寄せるか、XML も併用するかは未確定
