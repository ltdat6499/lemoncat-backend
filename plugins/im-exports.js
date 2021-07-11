const fs = require("fs");
const readline = require("readline");
const knex = require("../controllers/knex");
const tools = require("../global");

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
        `./database/${table}_${counter}.txt`,
        JSON.stringify(results),
        "utf8"
      );
      console.log(counter * limit);
      counter++;
    } else break;
  }
  console.log("Done");
};

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
  for (const file of files.filter((item) => item.includes(".txt"))) {
    let data = await loadArray(file);
    data = JSON.parse(data);
    await knex(file.split("_")[0]).insert(data);
    console.log(file, " DONE");
  }
  console.log("ALL DONE");
};

// const esExportPersons = async (table, limit) => {
//   limit = limit || 5000;
//   let counter = 0;
//   let results = [1, 2];
//   while (results.length) {
//     results = await knex(table)
//       .select("id", "name", "summary", "slug", "born_in", "birth", "images")
//       .limit(limit)
//       .offset(counter * limit);
//     results = results.map((result) => {
//       result.images = result.images[0];
//       return result;
//     });
//     if (results.length) {
//       await fs.appendFileSync(
//         `./database/${table}_${counter}.txt`,
//         JSON.stringify(results),
//         "utf8"
//       );
//       console.log(counter * limit);
//       counter++;
//     } else break;
//   }
//   console.log("Done");
// };

// const esExportFlims = async (table, limit) => {
//   limit = limit || 5000;
//   let counter = 0;
//   let results = [1, 2];
//   while (results.length) {
//     results = await knex(table)
//       .select("id", "type", "info", "streamings", "data", "slug")
//       .limit(limit)
//       .offset(counter * limit);
//     results = results.map((item) => {
//       return {
//         id: item.id,
//         type: item.type,
//         name: item.info.name,
//         summary: item.info.summary,
//         tags: item.info.tags.join(", "),
//         genres: item.info.genres.join(", "),
//         rating: item.info.rating,
//         poster: item.info.poster,
//         collection: item.info.collection,
//         productions: item.info.productions.join(", "),
//         theatersDate: item.info.theaters_date,
//         streamings: item.streamings.join(", "),
//         lemonScore: item.data.rotten_tomatoes.tomatometer_score,
//         slug: item.slug,
//       };
//     });
//     if (results.length) {
//       await fs.appendFileSync(
//         `./database/${table}_${counter}.txt`,
//         JSON.stringify(results),
//         "utf8"
//       );
//       console.log(counter * limit);
//       counter++;
//     } else break;
//   }
//   console.log("Done");
// };

// const esExportPosts = async (table, limit) => {
//   limit = limit || 5000;
//   let counter = 0;
//   let results = [1, 2];
//   while (results.length) {
//     results = await knex(table)
//       .select("id", "title", "content", "data", "tags", "slug")
//       .where({ type: "news" })
//       .limit(limit)
//       .offset(counter * limit);
//     results = results.map((item) => {
//       return {
//         id: item.id,
//         title: item.title,
//         content: tools.htmlToText(item.content),
//         section: item.data.section,
//         tags: item.tags.join(", "),
//         poster: item.data.preview_poster,
//         slug: item.slug,
//       };
//     });
//     if (results.length) {
//       await fs.appendFileSync(
//         `./database/${table}_${counter}.txt`,
//         JSON.stringify(results),
//         "utf8"
//       );
//       console.log(counter * limit);
//       counter++;
//     } else break;
//   }
//   console.log("Done");
// };

// esExportPersons("persons", 15000);
// esExportFlims("flims", 1000);
// esExportPosts("posts", 400);

// exportDatabase("actions", 10000)
// exportDatabase("flims", 500)
// exportDatabase("persons", 1000)
// exportDatabase("posts", 100)
// exportDatabase("users", 1000)
module.exports = {
  exportDatabase,
  importDatabase,
};
