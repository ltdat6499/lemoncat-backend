const knex = require("./knex");

const getAll = async () => {
  return await knex("flims").select();
};

const getById = async (id) => {
  return await knex("flims").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("flims").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("flims").del().where({ id }).returning("*");
};

const update = async (id, instance) => {
  return await knex("flims").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
