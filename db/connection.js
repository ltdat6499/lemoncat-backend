const config = require("../configs");

module.exports = require("knex")({
  client: config.client,
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  },
});
