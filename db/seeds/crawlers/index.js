const fs = require("fs");
const readline = require("readline");
const moment = require("moment");
const wilsonScore = require("wilson-score-rank");
const _ = require("lodash");
const knex = require("../../../controllers/knex");

const loadArray = async (path) => {
  const file = fs.createReadStream(path);

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

const setScoreChildComments = async (commentId) => {
  let comments = await knex("actions")
    .select("id")
    .where({ type: "comment", parent_type: "comment", parent: commentId });

  for (const item of comments) {
    let interacts = await knex("actions")
      .select("data", "uid")
      .where({ parent: item.id, type: "interact" });
    for (const interact of interacts) {
      const userElo = await knex("users")
        .select("data")
        .where({ id: interact.uid });
      interact.elo = parseInt(userElo[0].data.elo) / 100;
    }
    let total = 0,
      positive = 0;
    for (const interact of interacts) {
      switch (interact.data) {
        case "love":
          total += 4 * interact.elo;
          positive += 4 * interact.elo;
          break;
        case "care":
          total += 3 * interact.elo;
          positive += 3 * interact.elo;
          break;
        case "wow":
          total += 2 * interact.elo;
          positive += 2 * interact.elo;
          break;
        case "like":
          total += 4 * interact.elo;
          positive += 2 * interact.elo;
          break;
        case "dislike":
          total += 2 * interact.elo;
          break;
        case "angry":
          total += 4 * interact.elo;
          break;
        default:
          break;
      }
    }
    const score = wilsonScore.lowerBound(positive, total);
    await knex("actions")
      .update({
        score,
      })
      .where({ id: item.id });
    console.log({ id: item.id, score });
  }
  console.log("DONE");
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const deepClone = (data) => JSON.parse(JSON.stringify(data));
const base = {
  data: {},
  childComments: [],
  interacts: [],
};
const childBase = {
  data: {},
  interacts: [],
};
const pushData = async (data) => {
  let results = [];
  results = results.concat(data.interacts);
  for (const comment of data.comments) {
    results.push(comment.data);
    results = results.concat(comment.interacts);
    for (const iterator of comment.childComments) {
      results.push(iterator.data);
      results = results.concat(iterator.interacts);
    }
  }
  await knex("actions").insert(results);
  await knex("posts")
    .update({ score: data.score + "" })
    .where({ id: data.postId });
};

const getScore = (interacts) => {
  let total = 0,
    positive = 0;
  for (const interact of interacts) {
    switch (interact.data) {
      case "love":
        total += 4 * interact.score;
        positive += 4 * interact.score;
        break;
      case "care":
        total += 3 * interact.score;
        positive += 3 * interact.score;
        break;
      case "wow":
        total += 2 * interact.score;
        positive += 2 * interact.score;
        break;
      case "like":
        total += 4 * interact.score;
        positive += 2 * interact.score;
        break;
      case "dislike":
        total += 2 * interact.score;
        break;
      case "angry":
        total += 4 * interact.score;
        break;
      default:
        break;
    }
  }
  return wilsonScore.lowerBound(positive, total) || 0;
};

const cloneData = async (data, id) => {
  let reviewSlug = await knex("posts").select("slug").where({ id });
  reviewSlug = reviewSlug[0].slug;
  data.postId = id;
  for (const item of data.interacts) {
    item.parent = id;
    item.post = reviewSlug;
  }
  for (const item of data.comments) {
    let commentId = await knex.raw("select lemoncat.next_id() as id");
    commentId = commentId.rows[0].id;
    item.data.parent = id;
    item.data.post = reviewSlug;
    item.data.id = commentId;
    for (const iterator of item.interacts) {
      iterator.parent = commentId;
      iterator.post = reviewSlug;
    }
    for (const iterator of item.childComments) {
      let childCommentId = await knex.raw("select lemoncat.next_id() as id");
      childCommentId = childCommentId.rows[0].id;
      iterator.data.parent = commentId;
      iterator.data.id = childCommentId;
      iterator.post = reviewSlug;
      for (const interact of iterator.interacts) {
        interact.parent = childCommentId;
        interact.post = reviewSlug;
      }
    }
  }
  return data;
};

const executeScript = async () => {
  const comments = await loadArray("./data/comments.txt");
  const interacts = await loadArray("./data/interacts.txt");

  let news = await loadArray("./data/news.txt");
  news = _.shuffle(news);

  let reviews = await loadArray("./data/reviews.txt");
  reviews = _.shuffle(reviews);
  for (const newsId of news) {
    let newsSlug = await knex("posts").select("slug").where({ id: newsId });
    newsSlug = newsSlug[0].slug;
    const splitReviews = reviews.splice(0, 17);
    const maxComments = getRandomInt(7, 15);
    const result = {
      postId: newsId,
      score: 0,
      comments: [],
      interacts: [],
    };
    result.interacts = JSON.parse(
      interacts[getRandomInt(0, interacts.length - 1)]
    );
    for (const iterator of result.interacts) {
      iterator.parent_type = "post";
      iterator.parent = newsId;
      iterator.post = newsSlug;
    }
    result.score = getScore(result.interacts);

    for (let i = 0; i < maxComments; i++) {
      const skeleton = deepClone(base);
      const index = getRandomInt(0, comments.length - 1);
      skeleton.data = JSON.parse(comments[index]);
      skeleton.data.parent_type = "post";
      skeleton.data.parent = newsId;
      skeleton.data.post = newsSlug;
      let id = await knex.raw("select lemoncat.next_id() as id");
      id = id.rows[0].id;
      skeleton.data.id = id;
      skeleton.interacts = JSON.parse(interacts[index]);
      for (const iterator of skeleton.interacts) {
        iterator.parent = id;
        iterator.post = newsSlug;
      }
      const maxChildComments = getRandomInt(2, 6);
      for (let j = 0; j < maxChildComments; j++) {
        const childSkeleton = deepClone(childBase);
        const childIndex = getRandomInt(0, comments.length - 1);
        childSkeleton.data = JSON.parse(comments[childIndex]);
        childSkeleton.data.parent_type = "comment";
        childSkeleton.data.parent = id;
        childSkeleton.data.post = newsSlug;
        let childId = await knex.raw("select lemoncat.next_id() as id");
        childId = childId.rows[0].id;
        childSkeleton.data.id = childId;
        childSkeleton.interacts = JSON.parse(interacts[childIndex]);
        for (const iterator of childSkeleton.interacts) {
          iterator.parent = childId;
          iterator.post = newsSlug;
        }
        skeleton.childComments.push(childSkeleton);
      }

      //---------------------------------------------------------------------
      skeleton.data.score = getScore(skeleton.interacts);
      for (const iterator of skeleton.childComments) {
        skeleton.data.score += parseFloat(iterator.data.score);
      }
      result.score += skeleton.data.score;
      skeleton.data.score = skeleton.data.score + "";

      result.comments.push(skeleton);
    }

    // -----------------------------------------------------------------
    pushData(result);
    console.log(`News: ${newsId}`);
    for (const reviewId of splitReviews) {
      const data = await cloneData(result, reviewId);
      pushData(data);
      console.log(`Reviews: ${reviewId}`);
    }
  }
  console.log("DONE");
};

const getNull = async () => {
  const data = await knex.raw(
    `select id from posts where score = '0' and "type" = 'review'`
  );
  for (const item of data.rows) {
    await fs.appendFileSync(`./data/reviews.txt`, item.id + "\n", "utf8");
  }
  const data2 = await knex.raw(
    `select id from posts where score = '0' and "type" = 'news'`
  );
  for (const item of data2.rows) {
    await fs.appendFileSync(`./data/news.txt`, item.id + "\n", "utf8");
  }
  console.log("DONE");
};

// getNull();

// const setWk = async () => {
//   const data = await knex("users").select("id", "data").where({ role: "user" });
//   for (const item of data) {
//     if (!item.data.working) {
//       item.data.working = "LEMONCAT";
//       await knex("users").where({ id: item.id }).update({ data: item.data });
//       console.log(item.id);
//     }
//   }
// };

// love 4
// care 3
// wow  2
// like 1
// dislike 2
// angry 4
// User 1
// S-User 100
