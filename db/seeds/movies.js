const tools = require("../../global/");

exports.seed = async (knex) => {
  // const list = [];
  // for (const id of tools.movieIds) {
  //   list.push({
  //     id,
  //     name: tools.genName(),
  //     summary: tools.genParagraphs(5),
  //     genres: tools.getRandomCategories("genre", 5).map((item) => item.name),
  //     rating: tools._.head(tools.getRandomCategories("rating", 1)).name,
  //     on_screen: tools.genRandomFutureDate(),
  //     images: tools.genImages(10),
  //   });
  // }
  // return await knex("movies")
  //   .del()
  //   .then(async () => {
  //     await knex("movies").insert(list);
  //   });
};
