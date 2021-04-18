const knex = require("./knex");

const getAll = async () => {
  return await knex("movies").select();
};

const getById = async (id) => {
  return await knex("movies").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("movies").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("movies").del().where({ id });
};

const update = async (id, instance) => {
  return await knex("movies").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
