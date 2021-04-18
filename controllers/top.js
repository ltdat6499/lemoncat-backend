const knex = require("./knex");

const getAll = async () => {
  return await knex("tops").select();
};

const getById = async (id) => {
  return await knex("tops").select().where({ id }).first();
};

const create = async (instance) => {
  return await knex("tops").insert(instance).returning("*");
};

const deleteById = async (id) => {
  return await knex("tops").del().where({ id });
};

const update = async (id, instance) => {
  return await knex("tops").update(instance).where({ id }).returning("*");
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
