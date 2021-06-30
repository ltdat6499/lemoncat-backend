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

// exportDatabase("users");
// exportDatabase("actions");
// exportDatabase("persons");
// exportDatabase("flims");
// exportDatabase("posts", 2000);
const loadArray = async (name) => {
  const file = fs.createReadStream(name);

  const readLine = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of readLine) {
    results.push(line);
  }
  return results.reverse();
};
const importDatabase = async () => {
  const files = await fs.readdirSync("./");
  for (const file of files) {
    const data = await loadArray(file);
    await knex(file.split("_")[0]).insert(data);
    console.log(file, " DONE");
  }
  console.log("ALL DONE");
};

module.exports = {
  exportDatabase,
  importDatabase,
};
