const { posts } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async posts() {
      return await posts.getAll();
    },
    async post(__, args) {
      const { id } = args;
      return await posts.getById(id);
    },
  },
  Mutation: {
    async createPost(__, { input }) {
      input.id = tools.genId();
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await posts.create(input);
      return result;
    },
    async updatePost(__, args) {
      const { input, id } = args;
      const [result] = await posts.update(
        id,
        tools.changeCaseType(input, "snakeCase")
      );
      return result;
    },
    async deletePost(__, { id }) {
      const result = await posts.deleteById(id);
      return result.length;
    },
  },
  Post: {
    section: (parent) => parent.crawl_data.sections[0],
    previewPoster: (parent) => parent.crawl_data.preview_poster,
    date: (parent) => parent.crawl_data.date,
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  PostInteract: {
    user: async (parent) => await users.getById(parent.user),
  },
};
