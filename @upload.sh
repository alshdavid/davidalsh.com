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




PEN=$(echo "console.log(require('./jsonpen.json').pen)" | node)
USERNAME=$(echo "console.log(require('./jsonpen.json').username)" | node)
PASSWORD=$(echo "console.log(require('./jsonpen.json').password)" | node)
FILE=$(echo "console.log(require('./jsonpen.json').zipDir)" | node)

if [ -z "$PEN" ] || [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$PEN" ]
then 
  echo "Can't Get Credentials"
  exit 1
fi

num=$(curl \
  -s \
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

if [ $authorization == "null" ] 
then 
  echo "Login Failed"
  exit 1
fi

UPLOAD=$(curl \
  --progress-bar \
  -H "Content-Type: multipart/form-data" \
  -H "authorization: $authorization" \
  -F "file=@$DIR/$FILE;type=application/zip" \
  https://api.jsonpen.com/admin/upload)

SAVED=$(echo "console.log( ${UPLOAD}.message )" | node)

echo $SAVED