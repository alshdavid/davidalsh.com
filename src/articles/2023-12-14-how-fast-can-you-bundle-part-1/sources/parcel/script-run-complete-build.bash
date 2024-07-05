set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR

env \
  PARCEL_WORKERS=4 \
  PM_MEM_UNITS=mb \
  PM_TIME_UNITS=s \
  PM_TRACK=cpu,memory \
  PM_REPORT=parcel.csv \
    procmon \
      node \
        --max-old-space-size=10240 \
        ./node_modules/parcel/lib/bin.js \
            build ./entry/entry.js \
              --no-cache \
              --dist-dir ./dist 
              --cache-dir .cache
