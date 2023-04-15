#! /bin/sh
set -xeu

tag=${1:-"1.0"}

docker build -t eahazardswatch.icpac.net/eahw-analysis-gee:$tag .