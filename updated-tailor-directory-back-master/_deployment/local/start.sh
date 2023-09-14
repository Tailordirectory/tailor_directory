#!/usr/bin/env sh

set -e

PROJECT_NAME='api'

docker network create common || true

docker-compose --project-name $PROJECT_NAME up -d
