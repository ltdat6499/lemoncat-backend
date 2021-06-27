const controllers = require("../../../controllers");

module.exports = {
  Query: {
    async users(__, args) {
      const { page, size } = args;
      return await controllers.get("users", page, size);
    },
    async user(__, args) {
      const { id } = args;
      return await controllers.getById("users", id);
    },
  },
  Mutation: {
    async createUser(__, { input }) {
      const [result] = await controllers.create("users", input);
      return result;
    },
    async updateUser(__, args) {
      const { input, id } = args;
      const [result] = await controllers.update("users", id, input);
      return result;
    },
    async deleteUser(__, { id }) {
      const result = await controllers.deleteById("users", id);
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
  UserReport: {
    targetType: (parent) => parent.target_type,
    targetId: (parent) => parent.target_id,
    fromUser: async (parent) =>
      await controllers.getById("users", parent.fromUser),
  },
};
