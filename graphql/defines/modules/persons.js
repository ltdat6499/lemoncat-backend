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
    async personBySlug(__, args) {
      const { slug } = args;
      const result = await controllers.getByParams("persons", { slug }, 1, 1);
      return result[0];
    },
  },
  Mutation: {
    async updatePerson(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("persons", id, input);
      return result;
    },
  },
  Person: {
    flims: async (parent) => await controllers.persons.getFlims(parent.id),
    bornIn: (parent) => parent.born_in,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
