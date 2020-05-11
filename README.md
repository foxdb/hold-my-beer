# hold-my-beer

[![semaphore](https://foxdb.semaphoreci.com/badges/hold-my-beer.svg?key=933392f5-2057-4c80-af25-bfd8d4566daa&style=shields)](https://foxdb.semaphoreci.com/projects/hold-my-beer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![uptime](https://img.shields.io/uptimerobot/ratio/m781924275-98ea06fb7c37cccd077e3a95.svg)](http://hold-my-beer.smitchdigital.com/)

It's alive [here](http://hold-my-beer.smitchdigital.com/)

## Why

Homebrewing in a hot environment raises challenges. One of them is **temperature management**. During fermentation weeks, controlling the temperature is critical.

While [raspi-chill](https://github.com/foxdb/raspi-chill) regulates the temperature and collects data, `hold-my-beer` is in charge of data visualisation and alerts.

## Architecture

### Front end

- Typescript
- React.js
- Material UI
- Bundled with Parcel
- Deployed in AWS S3

### API

- Typescript functions deployed to AWS Lambda - API Gateway (via serverless)

### CI/CD and releases

- CI/CD: Semaphore 2
- Versioning management and changelogs: semantic-release
