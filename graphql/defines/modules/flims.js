const { flims, persons, posts, knex } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async flims() {
      return await flims.getAll();
    },
    async flim(__, args) {
      const { id } = args;
      return await flims.getById(id);
    },
  },
  Mutation: {
    async createFlim(__, { input }) {
      input.id = tools.genId();
      const [result] = await flims.create(
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async updateFlim(__, args) {
      const { input, id } = args;
      const [result] = await flims.update(
        id,
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async deleteFlim(__, { id }) {
      const result = await flims.deleteById(id);
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
    theatersDate: (parent) => parent.theaters_date,
    streamingDate: (parent) => parent.streaming_date,
    originalLanguage: (parent) => parent.original_language,
  },
  FlimCrew: {
    person: async (parent) => await persons.getById(parent.person),
  },
  FlimData: {
    trailerPhoto: (parent) => parent.trailer_photo,
    alsoLike: (parent) => parent.also_like,
    news: async (parent) => {
      const results = [];
      for (const item of parent.news) {
        const result = await posts.getById(item);
        results.push(result);
      }
      return results;
    },
    RottenTomatoes: (parent) => parent.rotten_tomatoes,
  },
  FlimTomatometer: {
    audienceScore: (parent) => parent.audience_score,
    tomatometerScore: (parent) => parent.tomatometer_score,
  },
};
