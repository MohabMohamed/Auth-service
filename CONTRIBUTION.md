# Contributing to Auth service

The goal of this file is to make contributing to this project as easy and transparent as possible.

---

## Pull requests

- Clone the repo and create your branch from master with `feature/name` or `issue/name`.
- If you've added code that should be tested, add tests.
- If you've changed APIs, update the documentation.

## Coding Style

- Don't overwrite any of the pre-commits
- I use standard coding rules, so please check that your code follows it
- Test everything

## Setting up

- Clone the repo using `git clone git@github.com:MohabMohamed/Auth-service.git`

- Install [Nodejs](https://nodejs.org)

- Install [Docker](https://docs.docker.com/install/)

- Install [Docker compose](https://docs.docker.com/compose/install/)
  
- Run `npm install`
  
- Run `npm run prepare:dev` to enable git pre-commits

- Run `cp config/example.env config/dev.env`

- Run `cp config/example.env config/prod.env`
  
- Run `cp config/example.env config/test.env`
  
- Change `config/test.env` , `config/dev.env` and `config/prod.env` to have your environment variables
  
- Run `docker-compose -f docker-compose.dev.yml up`
