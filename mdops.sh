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
    tmpdir=$(mktemp -d)
    trap "rm -rf $tmpdir" 0 2 3 15

    curl --progress-bar --fail --proto '=https' "https://pkgx.sh/$(uname)/$(uname -m)".tgz \
        | tar xz --directory "$tmpdir"

    $tmpdir/pkgx deno@1.41.2 run -A --unstable-ffi --unstable-fs \
        https://raw.githubusercontent.com/mdops-org/mdops-cli/main/main.ts "$@"
fi
