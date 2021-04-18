const tools = require("../../global");
const list = [];
let id = 1;
for (let i = 1; i <= 100; i++) {
  for (let t = 1; t <= 50; t++) {
    const rootId = id;
    list.push({
      id,
      parent: i,
      parent_type: "post",
      uid: t,
      interact: tools._.head(tools.getRandomCategories("interact", 1)).name,
      content: tools.genContent().content,
    });
    id++;
    for (let j = 0; j < 10; j++) {
      list.push({
        id,
        parent: rootId,
        parent_type: "comment",
        uid: tools.getRandomBetween(0, 101),
        interact: tools._.head(tools.getRandomCategories("interact", 1)).name,
        content: tools.genContent().content,
      });
      id++;
    }
  }
}
exports.seed = async (knex) => {
  return await knex("comments")
    .del()
    .then(async () => {
      for await (const item of list) await knex("comments").insert(item);
    });
};
