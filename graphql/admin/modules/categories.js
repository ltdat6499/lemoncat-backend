const { categories } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async categories() {
      return await categories.getAll();
    },
    async category(__, args) {
      const { id } = args;
      return await categories.getById(id);
    },
  },
  Mutation: {
    async createCategory(__, { input }) {
      input.id = tools.genId();
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await categories.create(input);
      return result;
    },
    async updateCategory(__, args) {
      const { input, id } = args;
      const [result] = await categories.update(
        id,
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async deleteCategory(__, { id }) {
      const result = await categories.deleteById(id);
      return result.length;
    },
  },
  Category: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  CategoryInput: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
