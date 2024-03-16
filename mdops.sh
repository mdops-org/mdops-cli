#!/usr/bin/env bash

set -euo pipefail

currentDir=$(pwd)
found=false

while [ "$currentDir" != "/" ]; do
    if [ -e "$currentDir/scripts/mdops" ]; then
        found=true
        break
    fi
    currentDir=$(dirname "$currentDir")
done

cmd="sh <(curl -Ssf https://pkgx.sh) deno@1.41.2 run -A --unstable-ffi --unstable-fs https://raw.githubusercontent.com/mdops-org/mdops-cli/main/main.ts"

if $found; then
    cmd="$currentDir/scripts/mdops"
fi

$cmd "$@"
