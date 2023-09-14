#!/usr/bin/env sh

PROJECT_NAME='api'

docker-compose --project-name $PROJECT_NAME logs -f --tail 250
