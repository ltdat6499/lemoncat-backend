const fs = require("fs");
const readline = require("readline");
const _ = require("lodash");
const { knex } = require("./controllers");
const loadArray = async () => {
  const file = fs.createReadStream("_comments__202106250345.txt");

  const readLine = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of readLine) {
    results.push(line);
  }
  return results;
};
let comments = [];
const run = async () => {
  const contents = await loadArray();
  for (let i = 0; i <= 285; i++) {
    comments = await knex("comments")
      .select("id")
      .where({ parent_type: "comments" })
      .offset(20000 * i)
      .limit(20000);
    for (const { id } of comments) {
      await knex("comments")
        .update({ content: _.shuffle(contents)[0] })
        .where({ id });
    }
    console.log(i);
  }
  console.log("DONE");
};

run();
