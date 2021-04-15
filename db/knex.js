const config = require("../configs/index");
var options = {
  development: {
    client: config.client,
    connection: {
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      charset: "utf8",
    },
    migrations: {
      directory: __dirname + config.migration,
    },
    seeds: {
      directory: __dirname + config.seed,
    },
  },
};

const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile.js")[environment];
module.exports = require("knex")(config);
