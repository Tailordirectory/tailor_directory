#!/usr/bin/env sh

set -e

PROJECT_NAME='api'

docker-compose --project-name $PROJECT_NAME down
