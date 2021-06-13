const tools = require("../../global/");
const { content } = tools.genContent();

exports.seed = async (knex) => {
  const list = [];
  for (const id of tools.postIds) {
    list.push({
      id,
      uid: tools.userIds[tools.getRandomBetween(-1, 100)],
      title: tools.genTitle(),
      content,
      tags: tools.genTags(10),
    });
  }
  return await knex("posts")
    .del()
    .then(async () => {
      await knex("posts").insert(list);
    });
};
