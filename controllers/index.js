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

const getByIds = async (table, ids) => {
  const results = [];
  for (const id of ids) {
    const result = await knex(table).select().where({ id }).first();
    if (result) results.push(result);
  }
  return results;
};

const posts = {
  get: async (
    page = 1,
    size = 10,
    type = "news",
    collection = "Critics Consensus",
    sortKey = "DATE"
  ) => {
    let results = knex("posts")
      .select()
      .where({ status: true, type })
      .limit(size)
      .offset((page - 1) * size);
    if (type === "news")
      results = results.andWhereRaw("cast(data->>'section' as text) = ?", [
        collection,
      ]);
    if (sortKey === "DATE") results = results.orderBy("updated_at", "desc");
    return await results;
  },
};

module.exports = {
  knex,
  get,
  getById,
  create,
  deleteById,
  update,
  getByParams,
  getByIds,
  posts,
};
