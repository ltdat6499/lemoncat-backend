const fs = require("fs");
const readline = require("readline");
const _ = require("lodash");
const { knex } = require("../../controllers");

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const loadArray = async () => {
  const file = fs.createReadStream("comments.txt");
  const lines = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of lines) {
    results.push(line);
  }
  return results;
};

const interacts = ["love", "care", "wow", "haha", "like", "angry", "unknown"];

const run = async () => {
  const source = await knex("posts").select("id");
  const messages = await loadArray();
  const ids = source.map((item) => item.id).reverse();
  let results = [];
  let total = 0;
  for (const id of ids) {
    const max = getRandom(5, 10);
    let counter = 1;
    while (counter <= max) {
      results.push({
        parent_type: "posts",
        parent: id,
        uid: id,
        interact: _.shuffle(interacts)[0],
        content: _.shuffle(messages)[0],
      });
      counter++;
    }
    if (results.length > 1000) {
      await knex("comments").insert(results);
      total += results.length;
      results = [];
      console.log(total);
    }
  }
  console.log("DONE");
};

// const run = async () => {
//   const source = await knex("posts").select("id");
//   const messages = await loadArray();
//   const ids = source.map((item) => item.id);
//   for (const id of ids) {
//     const max = getRandom(100, 200);
//     let counter = 1;
//     while (counter <= max) {
//       const data = {
//         parent_type: "posts",
//         parent: id,
//         uid: id,
//         interact: _.shuffle(interacts)[0],
//         content: _.shuffle(messages)[0],
//       };
//       const [result] = await knex("comments").insert(data).returning("*");
//       if (result) {
//         console.log(result.id);
//       }
//       counter++;
//     }
//   }
//   console.log("DONE");
// };
// let total = 0;
// let results = [];
// const run = async () => {
//   const source = await knex("comments")
//     .select("id")
//     .whereRaw("id % 2 != 0")
//     .andWhere({ parent_type: "posts" });
//   const messages = await loadArray();
//   let ids = source.map((item) => item.id);
//   ids = ids.slice(0, ids.length / 2);
//   for (const id of ids) {
//     const max = getRandom(0, 4);
//     let counter = 1;
//     while (counter <= max) {
//       const data = {
//         parent_type: "comments",
//         parent: id,
//         uid: id,
//         interact: _.shuffle(interacts)[0],
//         content: _.shuffle(messages)[0],
//       };
//       results.push(data);
//       counter++;
//     }
//     if (results.length > 1000) {
//       await knex("comments").insert(results).returning("*");
//       total += results.length;
//       results = [];
//       console.log(total);
//     }
//   }
//   console.log("DONE");
// };

run();
