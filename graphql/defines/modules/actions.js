const wilsonScore = require("wilson-score-rank");
const jwt = require("../../../middlewares/jwt");
const controllers = require("../../../controllers");
const { knex } = require("../../../controllers");
// const tools = require("../../../global");
const configs = require("../../../configs");

const setScore = async (postId) => {
  let totalScore = 0;
  let comments = await knex("actions")
    .select()
    .where({ type: "comment", parent_type: "post", parent: postId });

  for (const comment of comments) {
    comment.score = 0;
    const childComments = await knex("actions")
      .select()
      .where({ type: "comment", parent_type: "comment", parent: comment.id });

    for (const childComment of childComments) {
      const interacts = await knex("actions").select("data", "score").where({
        type: "interact",
        parent_type: "comment",
        parent: childComment.id,
      });

      let total = 0,
        positive = 0;
      for (const interact of interacts) {
        switch (interact.data) {
          case "love":
            total += 4 * interact.score;
            positive += 4 * interact.score;
            break;
          case "care":
            total += 3 * interact.score;
            positive += 3 * interact.score;
            break;
          case "wow":
            total += 2 * interact.score;
            positive += 2 * interact.score;
            break;
          case "like":
            total += 4 * interact.score;
            positive += 2 * interact.score;
            break;
          case "dislike":
            total += 2 * interact.score;
            break;
          case "angry":
            total += 4 * interact.score;
            break;
        }
      }
      childComment.score = wilsonScore.lowerBound(positive, total);
      comment.score += childComment.score;
    }

    const interacts = await knex("actions").select("data", "score").where({
      type: "interact",
      parent_type: "comment",
      parent: comment.id,
    });

    let total = 0,
      positive = 0;
    for (const interact of interacts) {
      switch (interact.data) {
        case "love":
          total += 4 * interact.score;
          positive += 4 * interact.score;
          break;
        case "care":
          total += 3 * interact.score;
          positive += 3 * interact.score;
          break;
        case "wow":
          total += 2 * interact.score;
          positive += 2 * interact.score;
          break;
        case "like":
          total += 4 * interact.score;
          positive += 2 * interact.score;
          break;
        case "dislike":
          total += 2 * interact.score;
          break;
        case "angry":
          total += 4 * interact.score;
          break;
      }
    }
    comment.score += wilsonScore.lowerBound(positive, total);
    totalScore += comment.score;
    const childIds = childComments.map((item) => item.id);
    await knex("actions").whereIn("id", childIds).del();
    await knex("actions").insert(childComments);
  }
  const ids = comments.map((item) => item.id);
  await knex("actions").whereIn("id", ids).del();
  await knex("actions").insert(comments);

  let interacts = await knex("actions")
    .select("data", "score")
    .where({ type: "interact", parent_type: "post", parent: postId });

  let total = 0,
    positive = 0;
  for (const interact of interacts) {
    switch (interact.data) {
      case "love":
        total += 4 * interact.score;
        positive += 4 * interact.score;
        break;
      case "care":
        total += 3 * interact.score;
        positive += 3 * interact.score;
        break;
      case "wow":
        total += 2 * interact.score;
        positive += 2 * interact.score;
        break;
      case "like":
        total += 4 * interact.score;
        positive += 2 * interact.score;
        break;
      case "dislike":
        total += 2 * interact.score;
        break;
      case "angry":
        total += 4 * interact.score;
        break;
    }
  }
  totalScore += wilsonScore.lowerBound(positive, total);
  await knex("posts").update({ score: totalScore }).where({ id: postId });
  console.log("Set score done");
};

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
      if (input.type === "interact") data.score = input.score;
      let result = {};
      if (input.action === "update")
        result = await controllers.update("actions", input.id, data);
      else if (input.action === "create") {
        data.id = input.id;
        result = await controllers.create("actions", data);
      } else if (input.action === "delete")
        result = await controllers.deleteById("actions", input.id);
      else
        return {
          result: {},
          error: "invalid action verb",
        };
      setScore(input.postId);
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
