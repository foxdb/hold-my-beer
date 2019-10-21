#!/bin/bash

cd api && yarn && yarn package
cd ..
cd client && yarn i && yarn build
cd ..
