// const tools = require("../../global");
// const list = [];
// let index = 0;
// for (let i = 0; i < 100; i++) {
//   for (let t = 0; t < 50; t++) {
//     const rootId = tools.commentIds[index];
//     list.push({
//       id: rootId,
//       parent: tools.postIds[i],
//       parent_type: "post",
//       uid: tools.userIds[t],
//       interact: tools._.head(tools.getRandomCategories("interact", 1)).name,
//       content: tools.genContent().content,
//     });
//     index++;
//     for (let j = 0; j < 10; j++) {
//       list.push({
//         id: tools.commentIds[index],
//         parent: rootId,
//         parent_type: "comment",
//         uid: tools.userIds[tools.getRandomBetween(-1, 100)],
//         interact: tools._.head(tools.getRandomCategories("interact", 1)).name,
//         content: tools.genContent().content,
//       });
//       index++;
//     }
//   }
// }
// exports.seed = async (knex) => {
//   return await knex("comments")
//     .del()
//     .then(async () => {
//       for await (const item of list) await knex("comments").insert(item);
//     });
// };
