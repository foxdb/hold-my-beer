#!/bin/bash

cd api && yarn && yarn deploy
cd ..
cd client && yarn && yarn deploy
cd ..
