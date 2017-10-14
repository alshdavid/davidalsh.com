#!/bin/bash
script="$0"
basename="$(dirname $script)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -rf @build
mkdir @build
cd www
npm run build
cd ..
cp -r www/public @build/dist
cd @build/dist
zip -r ../dist.zip *
cd ../../

