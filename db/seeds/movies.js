const tools = require("../../global/");

exports.seed = async (knex) => {
  const list = [];
  for (let i = 1; i <= 100; i++) {
    list.push({
      id: i,
      name: tools.genName(),
      summary: tools.genParagraphs(5),
      rating: tools._.head(tools.getRandomCategories("rating", 1)).name,
      on_screen: tools.genRandomFutureDate(),
      images: tools.genImages(10),
    });
  }
  return await knex("movies")
    .del()
    .then(async () => {
      await knex("movies").insert(list);
    });
};
