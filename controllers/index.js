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

const persons = {
  getFlims: async (id, page = "all", size = "all") => {
    if (page === "all" && size === "all") {
      return await knex("flims")
        .select()
        .whereRaw(`crews::text like '%${id}%'`);
    }
  },
};

const getFlimsByTop = async (year = "all", genre = "all") => {
  let results = knex("flims")
    .select()
    .whereRaw(`data->'rotten_tomatoes'->>'tomatometer_score' != ''`);
  if (year !== "all") {
    results = results.andWhereRaw(`created_at::text like '%${year}%'`);
  }
  if (genre !== "all") {
    results = results.andWhereRaw(`info->>'genres' like '%${genre}%'`);
  }
  results = await results;
  results = results.map((result) => {
    result.score = parseInt(result.data.rotten_tomatoes.tomatometer_score);
    return result;
  });
  results = _.sortBy(results, ["score"]).reverse();
  return _.slice(results, 0, 100);
};

const getFlimsByYear = async (size = 100, year = 2021) => {
  return await knex("flims")
    .select()
    .whereRaw(
      `
        info->>'theaters_date' like '%${year}%'
      `
    )
    .orderBy("created_at", "desc")
    .limit(size);
};

const getFlimsByYears = async (size = 20) => {
  let results = await knex.raw(`
    select *
    from flims m,(
      select distinct on (m.year) *
      from (
        select id, max(distinct data->'rotten_tomatoes'->>'tomatometer_score') as score, split_part(info->>'theaters_date', ', ', 2) as year
        from flims
        where data->'rotten_tomatoes'->>'tomatometer_score' != ''
        and CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= 80
        group by year, id
        order by score desc
      ) m
      order by m.year, m.score desc
    ) ids
    where ids.id = m.id
  `);
  results = await results;
  results = results.rows.map((result) => {
    result.score = parseInt(result.data.rotten_tomatoes.tomatometer_score);
    return result;
  });
  results = _.sortBy(results, ["score"]).reverse();
  return _.slice(results, 0, size);
};

const getFlimsForever = async (size = 20) => {
  let results = await knex.raw(`
    select *
    from flims m,(
      select id, CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) as score, split_part(info->>'theaters_date', ', ', 2) as year
      from flims
      where data->'rotten_tomatoes'->>'tomatometer_score' != ''
      and CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= 95
    ) ids
    where ids.id = m.id
    order by score desc, year desc
    limit ${size}
  `);
  results = await results;
  results = results.rows.map((result) => {
    result.score = parseInt(result.data.rotten_tomatoes.tomatometer_score);
    return result;
  });
  results = _.sortBy(results, ["score"]).reverse();
  return _.slice(results, 0, size);
};

const getFlimsTopToday = async (size = 100) => {
  return await knex("flims")
    .select()
    .whereRaw(`data->'rotten_tomatoes'->>'tomatometer_score' != ''`)
    .andWhereRaw(
      `
        CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= 80
      `
    )
    .orderBy("created_at", "desc")
    .limit(size);
};

const getFlimsStreaming = async (size = 100) => {
  return await knex("flims")
    .select()
    .whereRaw(`data->'rotten_tomatoes'->>'tomatometer_score' != ''`)
    .andWhereRaw(
      `
        CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= 80
      `
    )
    .andWhereRaw(`streamings::text like '%disney-plus-us%'`)
    .orderBy("created_at", "desc")
    .limit(size);
};

const getRelativeFlims = async (id) => {
  const data = await knex("flims").select().where({ id }).first();
  const resultsByName = await knex("flims").select().whereRaw(`
    lower(info->>'name') like '%${
      data.info.name.toLowerCase().replace(/[0-9]/g, "").trim() || ""
    }%'
  `);
  const resultsBySummary = await knex("flims").select().whereRaw(`
    lower(info->>'summary') like '%${
      data.info.name.toLowerCase().replace(/[0-9]/g, "").trim() || ""
    }%'
  `);
  const resultsByCrews = await knex("flims").select().whereRaw(`
    crews::text like '%${JSON.stringify(data.crews[0]) || ""}%'
  `);
  const director = _.find(data.crews, ["role", "Director"]);
  let resultsByDirector = [];
  if (director) {
    resultsByDirector = await knex("flims").select().whereRaw(`
      crews::text like '%${director.person}%'
    `);
  }

  let results = resultsByName
    .concat(resultsByCrews)
    .concat(resultsBySummary)
    .concat(resultsByDirector);
  results = results.map((item) => JSON.stringify(item));
  results = _.uniq(results);
  results = results.map((item) => JSON.parse(item));
  return results;
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
        .andWhere("created_at", ">=", moment().subtract(80, "days").format())
        .andWhere("created_at", "<=", moment().format())
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "ZOMBIETAG") {
      results = results
        .andWhereRaw(`info->>'tags' like '%zombie%'`)
        .limit(size);
    } else if (sortKey === "NETFLIX") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(80, "days").format())
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
        // item.score = await getScore("s-user", item.id);
        item.score = item.data.rotten_tomatoes.tomatometer_score || 0;
        res.push(item);
      }
      return _.sortBy(res, ["score"]).reverse().splice(0, size);
    } else if (sortKey === "NEWLYCERTIFIEDFRESH") {
      results = await results.orderBy("created_at", "desc").limit(100);
      const res = [];
      for (const item of results) {
        // item.score = await getScore("s-user", item.id);
        item.score = item.data.rotten_tomatoes.tomatometer_score || 0;
        res.push(item);
      }
      return _.sortBy(res, ["score"]).reverse().splice(0, size);
    } else if (sortKey === "SUPERHEROTAG") {
      results = results.andWhereRaw(`info->>'tags' like '%hero%'`).limit(size);
    } else if (sortKey === "POPULARSTREAMINGMOVIES") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(80, "days").format())
        .andWhere("created_at", "<=", moment().format())
        .andWhereRaw(`streamings::text like '%netflix%'`)
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "NEWMOVIESTHISWEEK") {
      results = results
        .andWhere("created_at", ">=", moment().format())
        .andWhere("created_at", "<=", moment().add(365, "days").format())
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "MOSTPOPULARMOVIESONLC") {
      results = results
        .andWhere("created_at", ">=", moment().subtract(100, "days").format())
        .andWhere("created_at", "<=", moment().add(100, "days").format())
        .orderBy("created_at", "desc")
        .limit(size);
    } else if (sortKey === "RANDOMFRESH") {
      results = results
        .andWhereRaw(
          "cast(data->'rotten_tomatoes'->>'tomatometer_score' as integer) >= 80"
        )
        .limit(100);
      results = await results;
      return _.shuffle(results).splice(0, size);
    }
    return await results;
  },
  getByParams: async (
    page = 1,
    size = 10,
    type = "movie",
    sortKey = "Release Date",
    params = {
      searchKey: "",
      range: [1, 99],
      genres: [],
      condition: "top_box_office",
    }
  ) => {
    const range = [
      `and CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= ${
        params.range[0] !== 1 ? params.range[0] : 1
      } `,
      `and CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) <= ${
        params.range[1] !== 99 ? params.range[1] : 99
      } `,
    ];
    let sort = "ORDER BY table_score.score desc";
    if (sortKey === "Release Date") sort = "ORDER BY flims.created_at desc";
    let genres = [];
    if (params.genres.length) {
      for (const item of params.genres) {
        genres.push(`and flims.info->>'genres' like '%${item}%'`);
      }
    }
    genres = genres.join(" ");
    let searchString = "";
    if (params.searchKey.length)
      searchString = `
      and ( lower(flims.info->>'name') like '%${params.searchKey.toLowerCase()}%' or lower(flims.info->>'summary') like '%${params.searchKey.toLowerCase()}%' )
      `;
    let condition = "";
    switch (params.condition) {
      case "opening_this_week":
        condition = `
        and created_at between '${moment().format(
          "DD-MM-YYYY H:mm:ss"
        )}' and '${moment().add(365, "days").format("DD-MM-YYYY H:mm:ss")}'
        `;
        break;
      case "top_box_office":
        condition = `
        and CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= 70
        `;
        break;
      case "opening_soon":
        condition = `
        and created_at between '${moment().format(
          "DD-MM-YYYY H:mm:ss"
        )}' and '${moment().add(120, "days").format("DD-MM-YYYY H:mm:ss")}'
        `;
        break;
      case "coming_soon":
        condition = `
        and created_at between '${moment().format(
          "DD-MM-YYYY H:mm:ss"
        )}' and '${moment().add(60, "days").format("DD-MM-YYYY H:mm:ss")}'
        `;
        break;
      case "weekend_earnings":
        condition = `
        and (
          info->>'genres' like '%kids & family%' or
          info->>'genres' like '%adventure%' or
          info->>'genres' like '%fantasy%'
        )
        `;
        break;
      case "certified_fresh":
        condition = `
        and CAST(data->'rotten_tomatoes'->>'tomatometer_score' AS integer) >= 80
        `;
        break;
      case "netflix":
        condition = `and streamings::text like '%netflix%'`;
        break;
      case "amazon_prime_video_us":
        condition = `and streamings::text like '%amazon-prime-video-us%'`;
        break;
      case "disney":
        condition = `and streamings::text like '%disney-plus-us%'`;
        break;
      case "hbo_max":
        condition = `and streamings::text like '%hbo-max%'`;
        break;
      case "hbo_now":
        condition = `and streamings::text like '%hbo-now%'`;
        break;
      case "fandango_now":
        condition = `and streamings::text like '%fandango-now%'`;
        break;
      case "vudu":
        condition = `and streamings::text like '%vudu%'`;
        break;
      case "apple_tv_plus_us":
        condition = `and streamings::text like '%apple-tv-plus-us%'`;
        break;
      case "peacock":
        condition = `and streamings::text like '%peacock%'`;
        break;
      case "hulu":
        condition = `and streamings::text like '%hulu%'`;
        break;
      case "itunes":
        condition = `and streamings::text like '%itunes%'`;
        break;
      default:
        condition = ``;
        break;
    }
    const queryBuilder = `select *
    from flims, (
      select id, data->'rotten_tomatoes'->>'tomatometer_score' as score
      from flims
      where data->'rotten_tomatoes'->>'tomatometer_score' != ''
      ${range[0]}
      ${range[1]}
      ${condition}
    ) as table_score
    where flims.id = table_score.id and flims.status = true and flims."type" = 'movie'
    ${genres}
    ${searchString}
    ${sort}
    limit ${size}
    offset ${(page - 1) * size}
    `;
    const data = await knex.raw(queryBuilder);
    const count = await knex.raw(`
    select count(*)
    from flims, (
      select id, data->'rotten_tomatoes'->>'tomatometer_score' as score
      from flims
      where data->'rotten_tomatoes'->>'tomatometer_score' != ''
      ${range[0]}
      ${range[1]}
      ${condition}
    ) as table_score
    where flims.id = table_score.id and flims.status = true and flims."type" = 'movie'
    ${genres}
    ${searchString}`);
    return {
      results: data.rows || [],
      count: count.rows[0].count || 0,
    };
  },
  countReviews: async (type, id) => {
    const result = await knex.raw(
      `select count(*) from posts p where p.data->>'flim' = ? and p."type" = 'reviews' and exists (select * from users u where u."role" = ? and u.id = p.uid)`,
      [id, type]
    );
    return result.rows[0].count;
  },
  getScore,
  getFlimsByYear,
  getFlimsTopToday,
  getFlimsStreaming,
  getFlimsByYears,
  getFlimsForever,
  getFlimsByTop,
  getRelativeFlims,
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
  persons,
};
