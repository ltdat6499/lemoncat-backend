const controllers = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async persons(__, args) {
      const { page, size } = args;
      return await controllers.get("persons", page, size);
    },
    async person(__, args) {
      const { id } = args;
      return await controllers.getById("persons", id);
    },
  },
  Mutation: {
    async createAction(__, { input }) {
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.create("persons", input);
      return result;
    },
    async updateAction(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("persons", id, input);
      return result;
    },
    async deleteAction(__, { id }) {
      const result = await controllers.deleteById("persons", id);
      return result.length;
    },
  },
  Person: {
    bornIn: (parent) => parent.born_in,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
