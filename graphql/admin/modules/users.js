const { users } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async users() {
      return await users.getAll();
    },
    async user(__, args) {
      const { id } = args;
      return await users.getById(id);
    },
  },
  Mutation: {
    async createUser(__, { input }) {
      input.id = tools.genId();
      const [result] = await users.create(input);
      return result;
    },
    async updateUser(__, args) {
      const { input, id } = args;
      const [result] = await users.update(id, input);
      return result;
    },
    async deleteUser(__, { id }) {
      const result = await users.deleteById(id);
      return result.length;
    },
  },
  User: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
