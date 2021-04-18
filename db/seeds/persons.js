const tools = require("../../global/");

exports.seed = async (knex) => {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    list.push({
      id: i,
      name: tools.genName(),
      birth: tools.genRandomPastDate(),
      born_in: tools.genCountryName(),
      summary: tools.genParagraphs(5),
      images: tools.genImages(10),
    });
  }
  return await knex("persons")
    .del()
    .then(async () => {
      await knex("persons").insert(list);
    });
};
