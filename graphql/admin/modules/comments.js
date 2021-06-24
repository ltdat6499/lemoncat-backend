const { comments, posts, users } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async comments() {
      return await comments.getAll();
    },
    async comment(__, args) {
      const { id } = args;
      return await comments.getById(id);
    },
  },
  Mutation: {
    async createComment(__, { input }) {
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await comments.create(input);
      return result;
    },
    async updateComment(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await comments.update(id, input);
      return result;
    },
    async deleteComment(__, { id }) {
      const result = await comments.deleteById(id);
      return result.length;
    },
  },
  Comment: {
    user: async (parent) => await users.getById(parent.uid),
    parentType: (parent) => parent.parent_type,
    parent: async (parent) => {
      if (parent.parent_type === "comments") {
        return await comments.getById(parent.parent);
      } else {
        return await posts.getById(parent.parent);
      }
    },
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
