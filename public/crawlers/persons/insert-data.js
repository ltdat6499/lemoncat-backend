const fs = require("fs");
const readline = require("readline");
const knex = require("../../../controllers/knex");

const loadArray = async () => {
  const file = fs.createReadStream("persons.txt");
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

const run = async () => {
  const data = await loadArray();
  for (let item of data) {
    if (!item.length) continue;
    try {
      item = JSON.parse(item);
      if (!item.summary.length) {
        item.summary =
          "Vivamus consectetur odio leo, vel pharetra est dignissim a. Aenean auctor risus nunc, id congue elit lacinia non. Mauris justo augue, faucibus ut rhoncus sit amet, convallis non leo. Fusce vel porttitor elit, at porttitor nisl. Vestibulum iaculis convallis ipsum a consequat. Phasellus consectetur lectus sed eros suscipit tempus. Sed pretium erat eget diam auctor, non sodales mauris egestas. Pellentesque sed tempus mi, ut elementum urna. Maecenas sollicitudin tortor quis vehicula euismod.";
      }
      if (
        item.images.length <= 1 &&
        item.images.includes(
          "/assets/pizza-pie/images/poster_default.c8c896e70c3.gif"
        )
      )
        item.images = [
          "https://i.pinimg.com/originals/12/a1/a7/12a1a70d052a487a185c01c25b71a09e.jpg",
        ];
      const [res] = await knex("persons").insert(item).returning("*");
      if (res) {
        console.log(res.id);
      }
    } catch (error) {
      continue;
    }
  }
  console.log("DONE");
};

run();
