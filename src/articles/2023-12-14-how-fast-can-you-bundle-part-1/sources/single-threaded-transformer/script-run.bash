set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR

env \
    PM_MEM_UNITS=mb \
    PM_TIME_UNITS=s \
    PM_TRACK=cpu,memory \
        procmon \
            ../target/release/single-threaded-transformer "../parcel/entry/entry.js"
