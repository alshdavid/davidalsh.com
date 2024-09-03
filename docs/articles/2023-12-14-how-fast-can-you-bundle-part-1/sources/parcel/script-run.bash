set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR

env \
  PARCEL_EXIT_TRANSFORM=true \
  PARCEL_WORKERS=16 \
  node \
    --max-old-space-size=5000 \
    ./node_modules/parcel/lib/bin.js \
      build ./entry/entry.js \
        --no-cache \
        --dist-dir ./dist \
        --cache-dir .cache
