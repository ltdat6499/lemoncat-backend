const { movies } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async movies() {
      return await movies.getAll();
    },
    async movie(__, args) {
      const { id } = args;
      return await movies.getById(id);
    },
  },
  Mutation: {
    async createMovie(__, { input }) {
      input.id = tools.genId();
      const [result] = await movies.create(
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async updateMovie(__, args) {
      const { input, id } = args;
      const [result] = await movies.update(
        id,
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async deleteMovie(__, { id }) {
      const result = await movies.deleteById(id);
      return result.length;
    },
  },
  Movie: {
    lemonScore: (parent) => parent.lemon_score,
    userScore: (parent) => parent.user_score,
    onScreen: (parent) => parent.on_screen,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  MovieInput: {
    onScreen: (parent) => parent.on_screen,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
