const knex = require("./knex");

const get = async (table, page, size) => {
  return await knex(table)
    .select()
    .limit(size)
    .offset(page * size);
};

const getById = async (table, id) => {
  return await knex(table).select().where({ id }).first();
};

const create = async (table, instance) => {
  return await knex(table).insert(instance).returning("*");
};

const deleteById = async (table, id) => {
  return await knex(table).del().where({ id }).returning("*");
};

const update = async (table, id, instance) => {
  return await knex(table).update(instance).where({ id }).returning("*");
};

const getByParams = async (table, params, page, size) => {
  return await knex(table)
    .select()
    .where(params)
    .limit(size)
    .offset(page * size);
};

module.exports = {
  knex,
  get,
  getById,
  create,
  deleteById,
  update,
  getByParams,
};
