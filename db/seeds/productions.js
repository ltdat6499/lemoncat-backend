const tools = require("../../global");

const list = [];
const genId = () => {
  let id = tools.randomIds[Math.floor(Math.random() * 115000)];
  while (list.includes(id))
    id = tools.randomIds[Math.floor(Math.random() * 115000)];
  return id;
};

exports.seed = async (knex) => {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 6; j++) {
      list.push({
        id: genId(),
        movie: tools.movieIds[i],
        person: tools.personIds[tools.getRandomBetween(-1, 500)],
        type: "actors",
        character: tools.genName(),
      });
    }
    for (let j = 0; j < 3; j++) {
      list.push({
        id: genId(),
        movie: tools.movieIds[i],
        person: tools.personIds[tools.getRandomBetween(-1, 500)],
        type: tools._.head(tools.getRandomCategories("production")).name,
      });
    }
  }
  return await knex("productions")
    .del()
    .then(async () => {
      await knex("productions").insert(tools._.uniqBy(list, "id"));
    });
};
