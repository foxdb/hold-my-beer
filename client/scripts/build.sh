#!/bin/bash

rm -r dist
npm run compile
./node_modules/parcel-bundler/bin/cli.js build ./src/index.html --no-source-maps --detailed-report --public-url 'http://hold-my-beer.smitchdigital.com/'