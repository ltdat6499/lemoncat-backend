require("dotenv").config();

module.exports = {
  client: process.env.PG_CLIENT || "pg",
  user: process.env.PG_USER || "docker",
  password: process.env.PG_PASSWORD || "docker",
  database: process.env.PG_DB || "lemoncat",
  host: process.env.PG_HOST || "127.0.0.1",
  dbPort: process.env.PG_PORT || "5432",
  migration: process.env.MIGRATION_PATH || "/db/migrations",
  seed: process.env.SEED_PATH || "/db/seeds",
  adminPassword: process.env.ADMIN_PASSWORD || "docker",
  knex: {
    client: process.env.PG_CLIENT || "pg",
    version: "13.0",
    connection: {
      host: process.env.PG_HOST || "127.0.0.1",
      user: process.env.PG_USER || "docker",
      password: process.env.PG_PASSWORD || "docker",
      database: process.env.PG_DB || "lemoncat",
      port: process.env.PG_PORT || "5432",
    },
  },
};
