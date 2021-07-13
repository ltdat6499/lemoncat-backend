const controllers = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    async posts(__, args) {
      const { page, size, type, collection, sortKey } = args;
      return await controllers.posts.get(page, size, type, collection, sortKey);
    },
    async post(__, args) {
      const { id } = args;
      return await controllers.getById("posts", id);
    },
    async latestNews(__, args) {
      return await controllers.posts.latestNews();
    },
    async latestGuides(__, args) {
      return await controllers.posts.latestGuides();
    },
    async menuPosts(__, args) {
      return await controllers.posts.menuPosts();
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
    sideTitle: (parent) => {
      let result = tools.htmlToText(parent.content).split(". ");
      result = result[result.length - 5 >= 0 ? result.length - 5 : 0];
      result = result.replace(
        /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
        " "
      );
      if (result.length > 110) return result.substring(0, 110) + " ...";
      return result;
    },
    rawContent: (parent) => tools.htmlToText(parent.content),
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
