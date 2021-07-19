const controllers = require("../../../controllers");
const jwt = require("../../../middlewares/jwt");
const configs = require("../../../configs");

module.exports = {
  Query: {
    async users(__, args) {
      const { page, size } = args;
      return await controllers.get("users", page, size);
    },
    async user(__, args) {
      const { id } = args;
      return await controllers.getById("users", id);
    },
    async getUserInfo(__, args) {
      const { token } = args;
      const auth = jwt.verify(token, configs.signatureKey);
      if (!auth.data.id)
        return {
          reviews: [],
          news: [],
          histories: [],
        };
      const id = auth.data.id;
      const histories = await controllers
        .knex("actions")
        .select()
        .where({ uid: id });
      const reviews = await controllers
        .knex("posts")
        .select()
        .where({ uid: id, type: "review" });
      const news = await controllers
        .knex("posts")
        .select()
        .where({ uid: id, type: "news" });

      return {
        reviews,
        news,
        histories,
      };
    },
  },
  Mutation: {
    async updateUser(__, args) {
      const { input, id } = args;
      const [result] = await controllers.update("users", id, input);
      return result;
    },
  },
  User: {
    createdAt: (parent) => parent.created_at,
    updatedAt: (parent) => parent.updated_at,
  },
  UserData: {
    activeAt: (parent) => parent.active_at,
  },
  UserReport: {
    targetType: (parent) => parent.target_type,
    targetId: (parent) => parent.target_id,
    fromUser: async (parent) =>
      await controllers.getById("users", parent.fromUser),
  },
};
