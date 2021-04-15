require("dotenv").config();

module.exports = {
  client: process.env.PG_CLIENT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  host: process.env.PG_HOST,
  dbPort: process.env.PG_PORT,
  migration: process.env.MIGRATION_PATH,
  seed: process.env.SEED_PATH,
  adminPassword: process.env.ADMIN_PASSWORD,
  knex: {
    client: process.env.PG_CLIENT,
    version: "13.0",
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      port: 5432,
    },
  },
};
