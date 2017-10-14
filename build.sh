#!/bin/bash
script="$0"
basename="$(dirname $script)"

rm -rf @build
mkdir @build
cp -r www @build/dist
cd @build/dist
zip -r ../dist.zip *
cd ../../


PEN="davidalsh"
USERNAME="alshdavid"
PASSWORD=""


num=$(curl \
  -X POST -H 'Content-Type: application/json' \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
  https://api.jsonpen.com/login/$PEN)

authorization=$(echo "\
  try { \
    let res = ${num}
    console.log( res.data.authorization ) \
  } catch (err) { \
    console.log(null) \
  }" | node)

UPLOAD=$(curl \
  -H "Content-Type: multipart/form-data" \
  -H "authorization: $authorization" \
  -F "file=@$basename/@build/dist.zip;type=application/zip" \
  https://api.jsonpen.com/admin/upload)

SAVED=$(echo "console.log( ${UPLOAD}.message )" | node)

echo $SAVED