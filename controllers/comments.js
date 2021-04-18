const knex = require("./knex");

const getAll = async () => {
  return await knex("comments").select();
};

const getById = async (id) => {
  return await knex("comments").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("comments").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("comments").del().where({ id });
};

const update = async (id, instance) => {
  return await knex("comments").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
