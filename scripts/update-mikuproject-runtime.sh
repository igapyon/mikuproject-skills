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

runtime_version="${MIKUPROJECT_RUNTIME_VERSION:-$(node "$mikuproject_root/bundle/mikuproject.mjs" --version | awk '{print $2}')}"
test -n "$runtime_version"

node_runtime="$runtime_root/mikuproject-$runtime_version.mjs"
node_sources="$runtime_root/mikuproject-sources-$runtime_version.tgz"
java_runtime="$runtime_root/mikuproject-$runtime_version.jar"
java_sources="$runtime_root/mikuproject-sources-$runtime_version.jar"

rm -f \
  "$runtime_root/mikuproject.jar" \
  "$runtime_root/mikuproject-sources.jar" \
  "$runtime_root/mikuproject.mjs" \
  "$runtime_root/mikuproject-sources.tgz"

cp "$mikuproject_root/bundle/mikuproject.mjs" "$node_runtime"
cp "$mikuproject_root/bundle/mikuproject-sources.tgz" "$node_sources"
cp "$mikuproject_java_root/target/mikuproject.jar" "$java_runtime"
cp "$mikuproject_java_root/target/mikuproject-sources.jar" "$java_sources"

java -jar "$java_runtime" ai spec >/dev/null
java -jar "$java_runtime" --version >/dev/null
node "$node_runtime" ai spec >/dev/null
node "$node_runtime" --version >/dev/null

cat <<EOF
[update-mikuproject-runtime] updated runtime artifacts
  - skills/mikuproject/runtime/mikuproject-$runtime_version.jar
  - skills/mikuproject/runtime/mikuproject-sources-$runtime_version.jar
  - skills/mikuproject/runtime/mikuproject-$runtime_version.mjs
  - skills/mikuproject/runtime/mikuproject-sources-$runtime_version.tgz
  - workplace: $workplace_root
  - mikuproject ref: $mikuproject_ref
  - mikuproject-java ref: $mikuproject_java_ref
EOF
