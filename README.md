# Rango


| Workflow | Status |
| --- | --- |
| **Build** | ![Build](https://github.com/FITCommunity/Rango/actions/workflows/build.yaml/badge.svg) |
| **Deploy** | ![Deploy](https://github.com/FITCommunity/Rango/actions/workflows/deploy.yaml/badge.svg) |


## Requirements

* Node.js 16.x

## Conventions

* https://github.com/airbnb/javascript
* https://github.com/conventional-changelog/commitlint

## Quick Start

```
git clone https://github.com/FITCommunity/Rango.git
cd Rango
npm install
cp .env.example .env
```

## How to run

Use `npm start` to run the bot when you create a command for the first time or make any modification of the command meta data (name, description, permissions, etc).

Use `npm dev` to run the bot while developing or debugging existing commands.

## Running Docker

To run the database in a Docker Container set the database env variables and run

```shell
docker-compose up -d [--build]
```
