const { persons } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async persons() {
      return await persons.getAll();
    },
    async person(__, args) {
      const { id } = args;
      return await persons.getById(id);
    },
  },
  Mutation: {
    async createPerson(__, { input }) {
      input.id = tools.genId();
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await persons.create(input);
      return result;
    },
    async updatePerson(__, args) {
      const { input, id } = args;
      const [result] = await persons.update(
        id,
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async deletePerson(__, { id }) {
      const result = await persons.deleteById(id);
      return result.length;
    },
  },
  Person: {
    bornIn: (parent) => parent.born_in,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  PersonInput: {
    bornIn: (parent) => parent.born_in,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
