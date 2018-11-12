#!/bin/bash

docker swarm init 
docker stack deploy -c docker-compose.local.yml hmb 