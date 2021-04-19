const knex = require("./knex");

const getAll = async () => {
  return await knex("productions").select();
};

const getById = async (id) => {
  return await knex("productions").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("productions").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("productions").del().where({ id }).returning("*");
};

const update = async (id, instance) => {
  return await knex("productions").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
