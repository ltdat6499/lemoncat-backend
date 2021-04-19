const { comments } = require("../../../controllers");
const { changeCaseType } = require("../../../global");

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
      input = changeCaseType(input, "snakeCase");
      console.log(
        "%c≫",
        "color: #0039f5",
        " ~ createComment ~ changeCaseType",
        input
      );
      const [result] = await comments.create(input);
      return result;
    },
    async updateComment(__, args) {
      const { input, id } = args;
      const [result] = await comments.update(id, input);
      return result;
    },
    async deleteComment(__, { id }) {
      const result = await comments.deleteById(id);
      return result.length;
    },
  },
  Comment: {
    parentType: (parent) => parent.parent_type,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  CommentInput: {
    parentType: (parent) => parent.parent_type,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
};
