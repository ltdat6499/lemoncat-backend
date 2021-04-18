const knex = require("./knex");

const getAll = async () => {
  return await knex("categories").select();
};

const getById = async (id) => {
  return await knex("categories").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("categories").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("categories").del().where({ id });
};

const update = async (id, instance) => {
  return await knex("categories").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
