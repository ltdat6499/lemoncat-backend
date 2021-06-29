const knex = require("./knex");

const run = async () => {
  let flims = await knex("flims").select("id", "updated_at");
  for (const item of flims) {
    if (!moment(item.updated_at).startOf("day").fromNow().includes("ago")) {
      let posts = await knex("posts")
        .select("id")
        .where({ type: "reviews" })
        .andWhereRaw("cast(data->>'flim' as TEXT) = ?", [item.id]);
      posts = posts.map((post) => post.id);

      for (const post of posts) {
        const postInteracts = await knex("actions")
          .select("id")
          .where({ type: "interacts", parent_type: "post", parent: post });
        await knex("actions")
          .whereIn(
            "id",
            postInteracts.map((item) => item.id)
          )
          .del();
        console.log(postInteracts);

        const postComments = await knex("actions")
          .select("id")
          .where({ type: "comment", parent_type: "post", parent: post });

        for (const { id: postComment } of postComments) {
          const commentInteracts = await knex("actions").select("id").where({
            type: "interacts",
            parent_type: "comment",
            parent: postComment,
          });

          await knex("actions")
            .whereIn(
              "id",
              commentInteracts.map((item) => item.id)
            )
            .del();
          console.log(commentInteracts);
        }

        for (const { id: postComment } of postComments) {
          const childComments = await knex("actions").select("id").where({
            type: "comment",
            parent_type: "comment",
            parent: postComment,
          });

          for (const childComment of childComments.map((item) => item.id)) {
            const childInteracts = await knex("actions").select("id").where({
              type: "interacts",
              parent_type: "comment",
              parent: childComment,
            });
            await knex("actions")
              .whereIn(
                "id",
                childInteracts.map((item) => item.id)
              )
              .del();
            console.log(childInteracts);
          }

          await knex("actions")
            .whereIn(
              "id",
              childComments.map((item) => item.id)
            )
            .del();
          console.log(childComments);
        }

        await knex("actions")
          .whereIn(
            "id",
            postComments.map((item) => item.id)
          )
          .del();
        console.log(postComments);
      }
    }
  }
  console.log("DONE");
};