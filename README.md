# mikuproject-skills

`mikuproject-skills` is an Agent Skills project designed around the open
Agent Skills standard published by Anthropic on December 18, 2025.

This repository reuses the full [`mikuproject`](./vendor/mikuproject)
repository via `git subtree` and builds AI-agent-facing skills on top of
the vendored upstream implementation.

The initial skill scaffold for this repository is available at
[`skills/mikuproject`](./skills/mikuproject).

## Positioning

This repository does not reference `mikuproject` as a git submodule.
It vendors the full upstream tree into `vendor/mikuproject/` by using
`git subtree`, and keeps it in sync as needed.

In short:

- upstream: `igapyon/mikuproject`
- local integration path: `vendor/mikuproject/`
- integration method: `git subtree`
- update operation: `subtree sync`

## Current State

The subtree sync that includes the reusable upstream APIs has been applied.

- local commit: `8845721`
- imported upstream commit: `ad15ace2e99a24348956fad04e5b052baf50fa65`
- included upstream API additions:
  - `globalThis.__mikuprojectAiJsonSpec`
  - `globalThis.__mikuprojectCoreApi`

## Sync Workflow

Fetch the latest upstream branch:

```bash
git fetch https://github.com/igapyon/mikuproject.git main
```

Sync `vendor/mikuproject/` from upstream:

```bash
git subtree pull --prefix=vendor/mikuproject https://github.com/igapyon/mikuproject.git main
```

Initial import for a new repository would be:

```bash
git subtree add --prefix=vendor/mikuproject https://github.com/igapyon/mikuproject.git main
```

## External Description

This wording is safe for README files and project explanations:

`mikuproject-skills` is an Agent Skills project designed around the open
Agent Skills standard and incorporates the full `mikuproject` repository
into `vendor/mikuproject/` via `git subtree`, syncing upstream changes as
needed.
