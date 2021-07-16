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
    async updateUser(__, args) {
      const { input, id } = args;
      const [result] = await controllers.update("users", id, input);
      return result;
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
