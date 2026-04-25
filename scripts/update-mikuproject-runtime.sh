#!/bin/sh
set -eu

repo_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
workplace_root="${MIKUPROJECT_SKILLS_WORKPLACE:-$repo_root/workplace}"
upstream_root="$workplace_root/upstream"
mikuproject_root="$upstream_root/mikuproject"
mikuproject_java_root="$upstream_root/mikuproject-java"
runtime_root="$repo_root/skills/mikuproject/runtime"

mikuproject_repo="${MIKUPROJECT_REPO:-https://github.com/igapyon/mikuproject.git}"
mikuproject_java_repo="${MIKUPROJECT_JAVA_REPO:-https://github.com/igapyon/mikuproject-java.git}"
mikuproject_ref="${MIKUPROJECT_REF:-devel}"
mikuproject_java_ref="${MIKUPROJECT_JAVA_REF:-devel}"

ensure_checkout() {
  target_dir="$1"
  repo_url="$2"
  ref_name="$3"

  if [ -d "$target_dir/.git" ]; then
    git -C "$target_dir" fetch --prune origin
    git -C "$target_dir" checkout "$ref_name"
    git -C "$target_dir" pull --ff-only origin "$ref_name"
  else
    mkdir -p "$(dirname -- "$target_dir")"
    git clone --branch "$ref_name" "$repo_url" "$target_dir"
  fi
}

mkdir -p "$upstream_root" "$runtime_root"

ensure_checkout "$mikuproject_root" "$mikuproject_repo" "$mikuproject_ref"
ensure_checkout "$mikuproject_java_root" "$mikuproject_java_repo" "$mikuproject_java_ref"

(
  cd "$mikuproject_root"
  npm ci
  npm run build:cli-bundle
)

(
  cd "$mikuproject_java_root"
  mvn package
)

test -s "$mikuproject_root/bundle/mikuproject.mjs"
test -s "$mikuproject_root/bundle/mikuproject-sources.tgz"
test -s "$mikuproject_java_root/target/mikuproject.jar"
test -s "$mikuproject_java_root/target/mikuproject-sources.jar"

cp "$mikuproject_root/bundle/mikuproject.mjs" "$runtime_root/mikuproject.mjs"
cp "$mikuproject_root/bundle/mikuproject-sources.tgz" "$runtime_root/mikuproject-sources.tgz"
cp "$mikuproject_java_root/target/mikuproject.jar" "$runtime_root/mikuproject.jar"
cp "$mikuproject_java_root/target/mikuproject-sources.jar" "$runtime_root/mikuproject-sources.jar"

java -jar "$runtime_root/mikuproject.jar" export-ai-json-spec >/dev/null
java -jar "$runtime_root/mikuproject.jar" --version >/dev/null
node "$runtime_root/mikuproject.mjs" ai spec >/dev/null
node "$runtime_root/mikuproject.mjs" --version >/dev/null

cat <<EOF
[update-mikuproject-runtime] updated runtime artifacts
  - skills/mikuproject/runtime/mikuproject.jar
  - skills/mikuproject/runtime/mikuproject-sources.jar
  - skills/mikuproject/runtime/mikuproject.mjs
  - skills/mikuproject/runtime/mikuproject-sources.tgz
  - workplace: $workplace_root
  - mikuproject ref: $mikuproject_ref
  - mikuproject-java ref: $mikuproject_java_ref
EOF
