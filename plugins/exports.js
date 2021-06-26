const knex = require("../controllers/knex");
const fs = require("fs");

const exportDatabase = async (table, limit) => {
  limit = limit || 500000;
  let counter = 0;
  let results = [1, 2];
  while (results.length) {
    results = await knex(table)
      .select()
      .limit(limit)
      .offset(counter * limit);
    if (results.length) {
      await fs.appendFileSync(
        `${table}_${counter}.txt`,
        JSON.stringify(results),
        "utf8"
      );
      console.log(counter * limit);
      counter++;
    } else break;
  }
  console.log("Done");
};

module.exports = exportDatabase;
