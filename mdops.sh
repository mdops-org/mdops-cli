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

if $found; then
    $currentDir/scripts/mdops "$@"
else
    eval "$(curl -Ssf https://pkgx.sh)"

    pkgx deno@1.41.2 run -A --unstable-ffi --unstable-fs https://raw.githubusercontent.com/mdops-org/mdops-cli/main/main.ts "$@"
fi
