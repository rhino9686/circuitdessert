#!/usr/bin/env bash
# Uploads everything in media-incoming/ to the Cloudflare R2 bucket and records it in the manifest.
# Needs: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET (set as repository secrets).
set -euo pipefail

: "${R2_ACCOUNT_ID:?}" "${R2_ACCESS_KEY_ID:?}" "${R2_SECRET_ACCESS_KEY:?}" "${R2_BUCKET:?}"
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION=auto
ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
MANIFEST="src/data/media-manifest.txt"

shopt -s nullglob
count=0
for f in media-incoming/*; do
  name="$(basename "$f")"
  case "$name" in README.md|.gitkeep) continue ;; esac

  case "${name##*.}" in
    webp) type="image/webp" ;;
    avif) type="image/avif" ;;
    svg)  type="image/svg+xml" ;;
    *) echo "Refusing to upload $name: unsupported type" >&2; exit 1 ;;
  esac

  local_size=$(stat -c %s "$f")
  if remote_size=$(aws s3api head-object --endpoint-url "$ENDPOINT" --bucket "$R2_BUCKET" --key "$name" --query ContentLength --output text 2>/dev/null); then
    if [ "$remote_size" = "$local_size" ]; then
      echo "Skipping $name: already uploaded with the same size"
    else
      echo "ERROR: $name already exists on the media host with a different size. File names are permanent; choose a new name." >&2
      exit 1
    fi
  else
    aws s3 cp "$f" "s3://$R2_BUCKET/$name" --endpoint-url "$ENDPOINT" \
      --content-type "$type" --cache-control "public, max-age=31536000, immutable" --no-progress
    echo "Uploaded $name"
  fi

  grep -qxF "$name" "$MANIFEST" || echo "$name" >> "$MANIFEST"
  count=$((count + 1))
done
echo "Processed $count file(s)."
