const { knex } = require("../../../controllers");

// const run = async () => {
//   const data = await knex("persons").select("id", "summary", "images");
//   for (let item of data) {
//     let flag = false;
//     if (!item.summary.length) {
//       flag = true;
//       item.summary =
//         "Vivamus consectetur odio leo, vel pharetra est dignissim a. Aenean auctor risus nunc, id congue elit lacinia non. Mauris justo augue, faucibus ut rhoncus sit amet, convallis non leo. Fusce vel porttitor elit, at porttitor nisl. Vestibulum iaculis convallis ipsum a consequat. Phasellus consectetur lectus sed eros suscipit tempus. Sed pretium erat eget diam auctor, non sodales mauris egestas. Pellentesque sed tempus mi, ut elementum urna. Maecenas sollicitudin tortor quis vehicula euismod.";
//     }
//     if (
//       item.images.length <= 1 &&
//       item.images.includes(
//         "/assets/pizza-pie/images/poster_default.c8c896e70c3.gif"
//       )
//     ) {
//       flag = true;
//       item.images = [
//         "https://i.pinimg.com/originals/12/a1/a7/12a1a70d052a487a185c01c25b71a09e.jpg",
//       ];
//     }
//     if (flag) {
//       const [res] = await knex("persons")
//         .update(item)
//         .where({ id: item.id })
//         .returning("*");
//       if (res) {
//         console.log(res.id);
//       } else {
//         console.log("ERR: ", item.id);
//       }
//     }
//   }
//   console.log("DONE");
// };
const run = async () => {
  const data = await knex("persons").select("id", "slug");
  const unique = [];

  const duplicates = data.filter((o) => {
    if (unique.find((i) => i.id !== o.id && i.slug === o.slug)) {
      return true;
    }
    unique.push(o);
    return false;
  });
  await knex("persons")
    .whereIn(
      "id",
      duplicates.map((i) => i.id)
    )
    .del();
  console.log("DONE");
};
run();
