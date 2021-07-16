const controllers = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async flims(__, args) {
      const { page, size, type, sortKey } = args;
      return await controllers.flims.get(page, size, type, sortKey);
    },
    async flimsByParams(__, args) {
      const { page, size, type, sortKey, params } = args;
      return await controllers.flims.getByParams(
        page,
        size,
        type,
        sortKey,
        params
      );
    },
    async flimByTop(__, args) {
      const { year, genre } = args;
      const results = {
        flims: await controllers.flims.getFlimsByTop(year, genre),
        topToday: await controllers.flims.getFlimsTopToday(10),
        topStreaming: await controllers.flims.getFlimsStreaming(10),
      };
      return results;
    },
    async alsoLikeFlims(__, args) {
      const { id } = args;
      return await controllers.flims.getRelativeFlims(id);
    },
    async sideMenuFlims(__, args) {
      return {
        byDate: await controllers.flims.get(1, 14, "movie", "DATE"),
        byFresh: await controllers.flims.get(
          1,
          14,
          "movie",
          "NEWLYCERTIFIEDFRESH"
        ),
        byFuture: await controllers.flims.get(
          1,
          14,
          "movie",
          "NEWMOVIESTHISWEEK"
        ),
        byPopular: await controllers.flims.get(
          2,
          14,
          "movie",
          "POPULARSTREAMINGMOVIES"
        ),
      };
    },
    async flimByTopPreview(__, args) {
      const results = {
        year1: await controllers.flims.getFlimsByYear(10, 2021),
        year2: await controllers.flims.getFlimsByYear(10, 2020),
        year3: await controllers.flims.getFlimsByYear(10, 2019),
        year4: await controllers.flims.getFlimsByYear(10, 2018),
        year5: await controllers.flims.getFlimsByYear(10, 2017),
        topToday: await controllers.flims.getFlimsTopToday(10),
        topStreaming: await controllers.flims.getFlimsStreaming(10),
        topByYear: await controllers.flims.getFlimsByYears(72),
        topForever: await controllers.flims.getFlimsForever(20),
      };
      return results;
    },
    async flimBySlug(__, args) {
      const { slug } = args;
      const result = await controllers.getByParams("flims", { slug }, 1, 1);
      return result[0];
    },
    async flim(__, args) {
      const { id } = args;
      return await controllers.getById("flims", id);
    },
  },
  Mutation: {
    async updateFlim(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("flims", id, input);
      return result;
    },
  },
  Flim: {
    whatToKnows: (parent) => parent.what_to_knows,
    userReviewCount: async (parent) =>
      await controllers.flims.countReviews("user", parent.id),
    lemonReviewCount: async (parent) =>
      await controllers.flims.countReviews("s-user", parent.id),
    userScore: (parent) => parent.data.rotten_tomatoes.audience_score || 0,
    // await controllers.flims.getScore("user", parent.id),
    lemonScore: (parent) => parent.data.rotten_tomatoes.tomatometer_score || 0,
    // await controllers.flims.getScore("s-user", parent.id),
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  FlimInfo: {
    soundMixs: (parent) => parent.sound_mixs,
    aspectRatio: (parent) => parent.aspect_ratio,
    theatersDate: (parent) => tools.formatLLToDefault(parent.theaters_date),
    streamingDate: (parent) => tools.formatLLToDefault(parent.streaming_date),
    originalLanguage: (parent) => parent.original_language,
  },
  FlimCrew: {
    person: async (parent) =>
      await controllers.getById("persons", parent.person),
  },
  FlimData: {
    trailerPhoto: (parent) => parent.trailer_photo,
    // topReviews: ()
    // alsoLike: (parent) => parent.also_like,
    news: async (parent) => await controllers.getByIds("posts", parent.news),
    rottenTomatoes: (parent) => parent.rotten_tomatoes,
  },
  FlimTomatometer: {
    audienceScore: (parent) => parent.audience_score,
    tomatometerScore: (parent) => parent.tomatometer_score,
  },
};
