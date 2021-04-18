const tools = require("../../global/");
const { content, contentHtml } = tools.genContent();

exports.seed = async (knex) => {
  const list = [];
  for (let i = 0; i < 100; i++) {
    list.push({
      uid: tools.getRandomBetween(0, 101),
      title: tools.genTitle(),
      content,
      content_html: contentHtml,
      tags: tools.genTags(10),
    });
  }
  return await knex("posts")
    .del()
    .then(async () => {
      await knex("posts").insert(list);
    });
};
