const config = require("./configs/");

module.exports = {
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
