const controllers = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async flims(__, args) {
      const { page, size } = args;
      return await controllers.get("flims", page, size);
    },
    async flim(__, args) {
      const { id } = args;
      return await controllers.getById("flims", id);
    },
  },
  Mutation: {
    async createFlim(__, { input }) {
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.create("flims", input);
      return result;
    },
    async updateFlim(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("flims", id, input);
      return result;
    },
    async deleteFlim(__, { id }) {
      const result = await controllers.deleteById("flims", id);
      return result.length;
    },
  },
  Flim: {
    whatToKnows: (parent) => parent.what_to_knows,
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
    RottenTomatoes: (parent) => parent.rotten_tomatoes,
  },
  FlimTomatometer: {
    audienceScore: (parent) => parent.audience_score,
    tomatometerScore: (parent) => parent.tomatometer_score,
  },
};
