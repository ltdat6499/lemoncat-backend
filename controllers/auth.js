const knex = require("./knex");

const findOne = async (params) => {
  return await knex("users").select().where(params);
};

module.exports = {
  findOne,
};
