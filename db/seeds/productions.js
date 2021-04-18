const tools = require("../../global");

exports.seed = async (knex) => {
  const list = [];
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 6; j++) {
      list.push({
        movie: i,
        person: tools.getRandomBetween(0, 501),
        type: "actors",
        character: tools.genName(),
      });
    }
    for (let j = 0; j < 3; j++) {
      list.push({
        movie: i,
        person: tools.getRandomBetween(0, 501),
        type: tools._.head(tools.getRandomCategories("production")).name,
      });
    }
  }
  return await knex("productions")
    .del()
    .then(async () => {
      await knex("productions").insert(list);
    });
};
