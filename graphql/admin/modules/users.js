const { users } = require("../../../controllers");

module.exports = {
  Query: {
    async users(req, res) {
      return {
        data: await users.getAll(),
        errors: [],
      };
    },
  },
  User: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
