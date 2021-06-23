// const { knex } = require("../../../controllers");

// const run = async () => {
//   const data = await knex("posts").select("id", "crawl_data");
//   const unique = [];

//   const duplicates = data.filter((o) => {
//     if (
//       unique.find((i) => i.id !== o.id && i.crawl_data.url === o.crawl_data.url)
//     ) {
//       return true;
//     }
//     unique.push(o);
//     return false;
//   });
//   await knex("posts")
//     .whereIn(
//       "id",
//       duplicates.map((i) => i.id)
//     )
//     .del();
//   console.log("DONE");
// };
// run();

// /*