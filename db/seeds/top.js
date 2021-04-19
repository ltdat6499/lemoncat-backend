const tools = require("../../global");

exports.seed = async (knex) => {
  const list = [];
  for (let year = 2000; year <= 2020; year++) {
    const winners = tools.getRandomCategories("winners", "full");
    const winnerCategories = tools.getRandomCategories(
      "winner categories",
      "full"
    );
    for (const winner of winners) {
      for (const category in winnerCategories) {
        list.push({
          id: tools.genId(),
          type: "winners",
          data: {
            id: tools.genId(),
            name: winner,
            type: category,
            movie: tools.movieIds[tools.getRandomBetween(-1, 100)],
          },
          year,
        });
      }
    }
  }
  return await knex("tops")
    .del()
    .then(async () => {
      await knex("tops").insert(tools._.uniqBy(list, "id"));
    });
};
