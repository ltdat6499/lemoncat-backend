const knex = require("./knex");

const getAll = async () => {
  return await knex("persons").select();
};

const getById = async (id) => {
  return await knex("persons").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("persons").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("persons").del().where({ id });
};

const update = async (id, instance) => {
  return await knex("persons").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
