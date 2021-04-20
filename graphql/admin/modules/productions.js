const { productions } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async productions() {
      return await productions.getAll();
    },
    async production(__, args) {
      const { id } = args;
      return await productions.getById(id);
    },
  },
  Mutation: {
    async createProduction(__, { input }) {
      input.id = tools.genId();
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await productions.create(input);
      return result;
    },
    async updateProduction(__, args) {
      const { input, id } = args;
      const [result] = await productions.update(
        id,
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async deleteProduction(__, { id }) {
      const result = await productions.deleteById(id);
      return result.length;
    },
  },
  Production: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  ProductionInput: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
