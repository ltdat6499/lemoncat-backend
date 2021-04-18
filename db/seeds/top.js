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
          type: "winners",
          data: {
            name: winner,
            type: category,
            movie: tools.getRandomBetween(0, 101),
          },
          year,
        });
      }
    }
  }
  return await knex("tops")
    .del()
    .then(async () => {
      await knex("tops").insert(list);
    });
};
