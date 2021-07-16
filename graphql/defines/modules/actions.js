const controllers = require("../../../controllers");
const tools = require("../../../global");
const jwt = require("../../../middlewares/jwt");
const configs = require("../../../configs");

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
      let { input } = args;
      // input = tools.changeCaseType(input, "snakeCase");
      const auth = jwt.verify(input.token, configs.signatureKey);
      if (!auth.data.id)
        return {
          result: {},
          error: auth.err,
        };
      let data = {
        type: input.type,
        parent: input.parent,
        parent_type: input.parentType,
        uid: auth.data.id,
        data: input.data,
      };
      let result = {};
      if (input.action === "update")
        result = await controllers.update("actions", input.id, data);
      else if (input.action === "create")
        result = await controllers.create("actions", data);
      else if (input.action === "delete")
        result = await controllers.deleteById("actions", input.id);
      else
        return {
          result: {},
          error: "invalid action verb",
        };
      return {
        result: result[0],
        error: "",
      };
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
