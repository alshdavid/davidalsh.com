set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR

cargo build --release
# time ../target/release/single-threaded-transformer-basic "../parcel/entry/entry.js"

env \
    PM_MEM_UNITS=mb \
    PM_TIME_UNITS=s \
    PM_TRACK=cpu,memory \
    PM_POLL_INTERVAL=200 \
        procmon \
            ../target/release/single-threaded-transformer-basic "../parcel/entry/entry.js"
