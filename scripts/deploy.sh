#!/bin/bash

cd api && yarn && yarn deploy
cd ..
cd client && yarn i && yarn deploy
cd ..
