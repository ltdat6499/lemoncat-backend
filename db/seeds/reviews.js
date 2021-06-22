const _ = require("lodash");
const { knex } = require("../../controllers");
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const skeleton = {
  type: "reviews",
  title: "",
  uid: 47286125203462,
  content: "",
  data: {
    flim: "",
    score: 50,
  },
  slug: "",
  tags: [],
  interacts: [
    // {
    //   user: "",
    //   interact: "",
    // },
  ],
  crawl_data: {},
};
const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const run = async () => {
  const news = await knex("posts").select("id", "content", "title", "slug");
  const newsIds = news.map((item) => item.id);
  let flims = await knex("flims").select("id");
  flims = flims.map((flim) => flim.id);
  for (const flim of flims) {
    let counter = 1;
    const maxGen = getRandom(25, 55);
    while (counter <= maxGen) {
      const post = deepClone(skeleton);
      const id = _.shuffle(newsIds)[0];
      const cloneData = deepClone(_.find(news, ["id", id]));
      post.title = cloneData.title;
      post.data.flim = flim;
      post.data.score = getRandom(60, 100);
      post.slug = cloneData.slug;
      post.content = cloneData.content;
      await knex("posts").insert(post);
      counter++;
    }
    console.log(flim);
  }
  console.log("DONE");
};

run();
