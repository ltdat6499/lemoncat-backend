const config = require("./configs");

module.exports = {
  development: {
    client: config.client || "pg",
    connection: {
      host: config.host || "127.0.0.1",
      user: config.user || "docker",
      password: config.password || "docker",
      database: config.database || "lemoncat",
      charset: "utf8",
    },
    migrations: {
      directory: __dirname + (config.migration || "/db/migrations"),
    },
    seeds: {
      directory: __dirname + (config.seed || "/db/seeds"),
    },
  },
};
