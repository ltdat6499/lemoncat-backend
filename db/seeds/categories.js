const { categoriesList: list } = require("../../global");

exports.seed = async (knex) => {
  return await knex("categories")
    .del()
    .then(async () => {
      await knex("categories").insert(list);
    });
};
