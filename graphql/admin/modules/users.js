const { users } = require("../../../controllers");

const schemaDefs = {
  name: "User",
  fields: {
    createdAt: {
      resolve: (parent) => parent.created_at,
    },
    updatedAt: {
      resolve: (parent) => parent.updated_at,
    },
  },
};

const resolvers = {
  Query: {
    users: async (req, res) => {
      return {
        data: [],
        errors: [],
      };
    },
  },
};

module.exports = {
  resolvers,
  schemaDefs,
};
