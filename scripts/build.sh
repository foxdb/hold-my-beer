#!/bin/bash

cd api && yarn && yarn package
cd ..
cd client && yarn && yarn build
cd ..
