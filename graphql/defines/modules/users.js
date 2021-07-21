const fs = require("fs");
const controllers = require("../../../controllers");
const jwt = require("../../../middlewares/jwt");
const configs = require("../../../configs");
const tools = require("../../../global");

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
      const { token, slug } = args;
      const auth = jwt.verify(token, configs.signatureKey);
      if (!auth.data.id)
        return {
          reviews: [],
          news: [],
          histories: [],
        };
      if (slug && slug.length) {
        const user = await controllers
          .knex("users")
          .select("id")
          .where({ slug })
          .limit(1);
        const id = user[0].id;
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
      } else {
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
      }
    },
  },
  Mutation: {
    async updateUser(__, args) {
      let { input } = args;
      const auth = jwt.verify(input.token, configs.signatureKey);
      if (!auth.data.id)
        return {
          result: {},
          error: auth.err,
        };
      let result;
      if (input.action === "update") {
        const user = await controllers
          .knex("users")
          .select()
          .where({ id: auth.data.id })
          .first();
        if (user.password && user.password.length && input.password.length) {
          user.password = await tools.hashPassword(input.password);
        }
        user.name = input.name;
        user.image = input.image;
        user.data.working = input.working;
        result = await controllers.update("users", auth.data.id, user);
      } else if (input.action === "create") {
        data.id = auth.data.id;

        result = await controllers.create("users", data);
      } else
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
