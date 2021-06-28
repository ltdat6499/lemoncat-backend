const controllers = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async posts(__, args) {
      const { page, size } = args;
      return await controllers.get("posts", page, size);
    },
    async post(__, args) {
      const { id } = args;
      return await controllers.getById("posts", id);
    },
  },
  Mutation: {
    async createPost(__, { input }) {
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.create("posts", input);
      return result;
    },
    async updatePost(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("posts", id, input);
      return result;
    },
    async deletePost(__, { id }) {
      const result = await controllers.deleteById("posts", id);
      return result.length;
    },
  },
  Post: {
    user: async (parent) => await controllers.getById("users", parent.uid),
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  PostData: {
    section: (parent) => parent.section || "",
    score: (parent) => parent.score || 0,
    previewPoster: (parent) => parent.preview_poster,
    flim: async (parent) =>
      parent.flim ? await controllers.getById("flims", parent.flim) : null,
  },
};
