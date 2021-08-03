<h1 align="center">Welcome to Lemoncat Reporter 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ltdat6499/lemoncat#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ltdat6499/lemoncat/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> Lemoncat project is a Website built on Nodejs, Graphql. The project has a mission to provide information and movie news to users. In addition, the project also compensates for the shortcomings of information sites such as Hollywood reporter, Rottentomatoes. As well as solving Spam problems

## Requirements

* Node 14
* Docker Compose
* Graphql
* Postgres

## Setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/ltdat6499/lemoncat-backend.git
cd lemoncat-backend
```

```bash
npm install
```

```sh
docker-compose up
```

```sh
cd db
knex migrate:latest
```

## Steps for read and write access (recommended)
Setup ENV:
```
PG_CLIENT=pg
PG_USER=docker
PG_PASSWORD=docker
PG_DB=lemoncat
PG_HOST=127.0.0.1
PG_PORT=5432
MIGRATION_PATH=/db/migrations
SEED_PATH=/db/seeds
ADMIN_PASSWORD=docker
PORT=5432
GOOGLE_CONSUMER_KEY=<GOOGLE_KEY>
GOOGLE_CONSUMER_SECRET=<GOOGLE_SECRET>
FACEBOOK_CLIENT_ID=<FACEBOOK_ID>
FACEBOOK_CLIENT_SECRET=<FACEBOOK_SECRET>
JWT_KEY=<JWT_KEY>
FLICKR_CONSUMER_KEY=<FLICKR_KEY>
FLICKR_CONSUMER_SECRET=<FLICKR_SECRET>
FLICKR_OAUTH_TOKEN=<FLICKR_TOKEN>
FLICKR_OAUTH_TOKEN_SECRET=<FLICKR_TOKEN_SECRET>
```

Final Step:

Open [http://localhost:3841/graphql](http://localhost:3841/graphql) and call graphql api

## Usage

```sh
docker-compose up
```

## Author

👤 **Kaido Jin**

* Website: https://www.linkedin.com/in/dat-ly-thanh-2230a41a9/
* Github: [@ltdat6499](https://github.com/ltdat6499)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/ltdat6499/lemoncat/issues). You can also take a look at the [contributing guide](https://github.com/ltdat6499/lemoncat/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Kaido Jin](https://github.com/ltdat6499).
This project is [ISC](https://github.com/ltdat6499/lemoncat/blob/master/LICENSE) licensed.
