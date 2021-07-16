const controllers = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async actions(__, args) {
      const { page, size } = args;
      return await controllers.get("actions", page, size);
    },
    async action(__, args) {
      const { id } = args;
      return await controllers.getById("actions", id);
    },
  },
  Mutation: {
    async updateAction(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("actions", id, input);
      return result;
    },
  },
  Action: {
    user: async (parent) => await controllers.getById("users", parent.uid),
    parentType: (parent) => parent.parent_type,
    parent: async (parent) => {
      switch (parent.parent_type) {
        case "post":
          return await controllers.getById("posts", parent.parent);
        case "comment":
          return await controllers.getById("actions", parent.parent);
        default:
          return {};
      }
    },
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
