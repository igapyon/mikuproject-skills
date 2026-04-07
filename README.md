# mikuproject-skills

`mikuproject-skills` is an Agent Skills project that reuses the full
[`mikuproject`](./vendor/mikuproject) repository via `git subtree`.

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

The initial subtree import has already been applied.

- local commit: `20a09b6`
- imported upstream commit: `30e961cd94a52610e064ca586afe5afbb85cc7dd`

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

`mikuproject-skills` is an Agent Skills project that incorporates the full
`mikuproject` repository into `vendor/mikuproject/` via `git subtree` and
syncs upstream changes as needed.
