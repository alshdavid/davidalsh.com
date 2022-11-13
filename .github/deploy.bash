#!/bin/bash

set -e

export AWS_DEFAULT_OUTPUT="yaml"
export AWS_PAGER=
export AWS_EC2_METADATA_DISABLED=true

npm install -g pnpm

make build

aws s3 rm --recursive s3://alshdavid-web-com-davidalsh-www
aws s3 cp --recursive ./dist s3://alshdavid-web-com-davidalsh-www --cache-control 'no-cache, no-store, must-revalidate'
aws cloudfront create-invalidation --distribution-id E1RN9EP7R6042I --paths /\*

# TODO maybe pre-compress the files and upload them?
# aws s3 cp --recursive --content-encoding br --exclude ".github/**" ./ s3://davidalsh.com/post