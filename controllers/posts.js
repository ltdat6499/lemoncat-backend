const knex = require("./knex");

const getAll = async () => {
  return await knex("posts").select();
};

const getById = async (id) => {
  return await knex("posts").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("posts").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("posts").del().where({ id }).returning("*");
};

const update = async (id, instance) => {
  return await knex("posts").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
