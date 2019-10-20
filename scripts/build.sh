#!/bin/bash

cd api && yarn && yarn package
cd ..
cd client && npm i && npm run build
cd ..
