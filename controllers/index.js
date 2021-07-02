const _ = require("lodash");
const moment = require("moment");
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
    .offset((page - 1) * size);
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
    collection,
    sortKey = "DATE"
  ) => {
    let results = knex("posts")
      .select()
      .where({ status: true, type })
      .limit(size)
      .offset((page - 1) * size);
    if (type === "news" && collection && collection.length)
      results = results.andWhereRaw("cast(data->>'section' as text) = ?", [
        collection,
      ]);
    if (sortKey === "DATE") results = results.orderBy("updated_at", "desc");
    return await results;
  },
};

const getScore = async (type = "s-user", id) => {
  const reviews = await knex.raw(
    `select * from posts p where p.data->>'flim' = ? and p."type" = 'reviews' and exists (select * from users u where u."role" = ? and u.id = p.uid)`,
    [id, type]
  );
  if (reviews.rows.length) {
    let result = 0;
    for (const item of reviews.rows) {
      result += item.data.score;
    }
    return parseInt(result / reviews.rows.length);
  }
  return -1;
};

const flims = {
  get: async (page = 1, size = 10, type = "movie", sortKey = "DATE") => {
    let results = knex("flims")
      .select()
      .where({ status: true, type })

      .offset((page - 1) * size);
    if (sortKey === "DATE")
      results = results.orderBy("created_at", "desc").limit(size);
    else if (sortKey === "POPULARINTHEATERS") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(20, "days").format())
        .andWhere("created_at", "<=", moment().format())
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "ZOMBIETAG") {
      results = results
        .andWhereRaw(`info->>'tags' like '%zombie%'`)
        .limit(size);
    } else if (sortKey === "NETFLIX") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(20, "days").format())
        .andWhere("created_at", "<=", moment().format())
        .andWhereRaw(`streamings::text like '%netflix%'`)
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "BLOCKBUSTER") {
      results = results
        .andWhere("created_at", "<=", moment("Jan 1, 1995").format())
        .andWhere("created_at", ">=", moment("Jan 1, 1985").format())
        .limit(100);
      results = await results;
      const res = [];
      for (const item of results) {
        item.score = await getScore("s-user", item.id);
        res.push(item);
      }
      return _.sortBy(res, ["score"]).reverse().splice(0, size);
    } else if (sortKey === "NEWLYCERTIFIEDFRESH") {
      results = await results.orderBy("created_at", "desc").limit(100);
      const res = [];
      for (const item of results) {
        item.score = await getScore("s-user", item.id);
        res.push(item);
      }
      return _.sortBy(res, ["score"]).reverse().splice(0, size);
    } else if (sortKey === "SUPERHEROTAG") {
      results = results.andWhereRaw(`info->>'tags' like '%hero%'`).limit(size);
    } else if (sortKey === "POPULARSTREAMINGMOVIES") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(20, "days").format())
        .andWhere("created_at", "<=", moment().format())
        .andWhereRaw(`streamings::text like '%netflix%'`)
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "NEWMOVIESTHISWEEK") {
      results = results
        .andWhere("created_at", ">=", moment().format())
        .andWhere("created_at", "<=", moment().add(7, "days").format())
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "MOSTPOPULARMOVIESONLC") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(30, "days").format())
        .andWhere("created_at", "<=", moment().add(30, "days").format())
        .orderBy("created_at", "desc")
        .limit(size);
    }
    return await results;
  },
  countReviews: async (type, id) => {
    const result = await knex.raw(
      `select count(*) from posts p where p.data->>'flim' = ? and p."type" = 'reviews' and exists (select * from users u where u."role" = ? and u.id = p.uid)`,
      [id, type]
    );
    return result.rows[0].count;
  },
  getScore,
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
  flims,
};
