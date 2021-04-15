const knex = require("./knex");

const getAll = async () => {
  return await knex("table").select();
};

module.exports = {
  getAll,
};
