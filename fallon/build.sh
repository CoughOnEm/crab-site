#!/usr/bin/env bash
# Cloudflare Pages build step: bake the generated photography into the deploy
# so the live sites never depend on the image CDN. Reads fallon/images.json.
# Build command:   bash build.sh     (run with root directory set to fallon/)
# Output directory: .
set -euo pipefail
cd "$(dirname "$0")"

BASE=$(sed -n 's/.*"base": *"\([^"]*\)".*/\1/p' images.json)

sed -n 's/^ *"\([a-z0-9-]*\.webp\)": *"\(hf_[^"]*\)".*/\1 \2/p' images.json |
while read -r name file; do
  for dir in premium/img ultra/img; do
    mkdir -p "$dir"
    if [ ! -f "$dir/$name" ]; then
      echo "fetch $dir/$name"
      curl -fsSL --retry 3 -o "$dir/$name" "$BASE$file" || echo "WARN: could not fetch $name (site falls back to CDN)"
    fi
  done
done
echo "build.sh done"
