#!/bin/bash

cd client && yarn && yarn build
cd ..
cd lambda && yarn && yarn build
cd ..
