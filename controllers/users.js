const knex = require("./knex");

const getAll = async () => {
  return await knex("users").select();
};

const getById = async (id) => {
  return await knex("users").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("users").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("users").del().where({ id }).returning("*");
};

const update = async (id, instance) => {
  return await knex("users").update(instance).where({ id }).returning("*");
};

const getByParams = async (params) => {
  return await knex("users").select().where(params);
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
  getByParams,
};
