#!/bin/bash
export AWS_DEFAULT_OUTPUT="yaml"
export AWS_PAGER=
export AWS_EC2_METADATA_DISABLED=true

aws s3 rm --recursive --exclude "blog/*" s3://alshdavid-web-com-davidalsh-www
aws s3 cp --recursive ./dist s3://alshdavid-web-com-davidalsh-www
aws cloudfront create-invalidation --distribution-id E1RN9EP7R6042I --paths /\*

# TODO maybe pre-compress the files and upload them?
# aws s3 cp --recursive --content-encoding br --exclude ".github/**" ./ s3://davidalsh.com/blog