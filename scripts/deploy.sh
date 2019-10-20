#!/bin/bash

cd api && yarn && yarn deploy
cd ..
cd client && npm i && npm run deploy
cd ..
