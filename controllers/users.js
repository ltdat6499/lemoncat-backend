const knex = require("./knex");

const getAll = async () => {
  return await knex("users").select();
};

module.exports = {
  getAll,
};
