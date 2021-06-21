const { flims } = require("../../../controllers");
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
    lemonScore: (parent) => parent.lemon_score,
    userScore: (parent) => parent.user_score,
    onScreen: (parent) => parent.on_screen,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  FlimInput: {
    onScreen: (parent) => parent.on_screen,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
