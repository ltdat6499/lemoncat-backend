const { users } = require("../../../controllers");

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
  UserData: {
    activeAt: (parent) => parent.active_at,
  },
  Report: {
    targetType: (parent) => parent.target_type,
    targetId: (parent) => parent.target_id,
    user: async (parent) => await users.getById(parent.user),
  },
};
