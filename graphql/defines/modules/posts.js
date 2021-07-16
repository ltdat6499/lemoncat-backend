const controllers = require("../../../controllers");
const tools = require("../../../global");
const cheerio = require("cheerio");

module.exports = {
  Query: {
    async posts(__, args) {
      const { page, size, type, section } = args;
      return await controllers.posts.get(page, size, type, section);
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
    async freshNewsInWeek(__, args) {
      return await controllers.posts.freshNewsInWeek();
    },
    async postBySlug(__, args) {
      const { slug } = args;
      let result = await controllers.getByParams("posts", { slug }, 1, 1);
      result = result[0];
      const $ = cheerio.load(result.content);
      const content = $("div[class='panel-body']")
        .find("div[class='articleContentBody']")
        .html();
      if (content) result.content = content;
      return result;
    },
  },
  Mutation: {
    async updatePost(__, args) {
      let { input, id } = args;
      input = tools.changeCaseType(input, "snakeCase");
      const [result] = await controllers.update("posts", id, input);
      return result;
    },
  },
  Interact: {
    user: async (parent) => await controllers.getById("users", parent.uid),
    emoji: (parent) => parent.data,
  },
  Comment: {
    user: async (parent) => await controllers.getById("users", parent.uid),
    content: (parent) => parent.data,
    childComments: async (parent) =>
      await controllers.getByParamsUnlimit("actions", {
        type: "comment",
        parent_type: "comment",
        parent: parent.id,
      }),
    interacts: async (parent) =>
      await controllers.getByParamsUnlimit("actions", {
        type: "interact",
        parent_type: "comment",
        parent: parent.id,
      }),
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  Post: {
    comments: async (parent) =>
      await controllers.getByParamsUnlimit("actions", {
        type: "comment",
        parent_type: "post",
        parent: parent.id,
      }),
    interacts: async (parent) =>
      await controllers.getByParamsUnlimit("actions", {
        type: "interact",
        parent_type: "post",
        parent: parent.id,
      }),
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
