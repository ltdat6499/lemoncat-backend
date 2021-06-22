const fs = require("fs");
const _ = require("lodash");
const { knex } = require("../../../controllers");
// const faker = require("faker");
// const photos = [
//   "https://upload.wikimedia.org/wikipedia/en/1/10/The_Lego_Movie_poster.jpg",
//   "https://www.cnet.com/a/img/resize/38878b4401154eb2c4cd9c4d09bf39b9c70ad827/hub/2021/01/05/c038963b-027d-40e5-a158-2d0d0617b4e3/black-widow-marvel-poster-crop.jpg?auto=webp&width=1092",
//   "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201910/warr-770x433.jpeg?54Ca7.SmVmwNrlVarS3qz4.4AmY_AbOj",
//   "https://www.studiomoviegrill.com/content/743fb356-6f14-4cb1-a9f7-2a0cecb2d3e6.jpg",
//   "https://terrigen-cdn-dev.marvel.com/content/prod/1x/shangchi_lob_crd-04.jpg",
//   "https://www.moviehouse.co.uk/Media/775c6248-c78f-43e8-8cb3-cc9a4722d1b0.jpg",
// ];

// const quotes = [
//   {
//     name: "Ed Warren",
//     content:
//       "It was big mistake, acknowledging this doll. Though it. The inhuman spirit tricked you..",
//   },
//   {
//     name: "Roger Perron",
//     content: "I don't know what you are! But you leave my wife alone damn you!",
//   },
//   {
//     name: "Bathsheba",
//     content: "She's already gone.. And now your all gonna die",
//   },
//   {
//     name: "Ed Warren",
//     content: "Sometimes it's better to keep the genie in the bottle",
//   },
//   {
//     name: "Drew",
//     content: "You can't shoot a ghost.",
//   },
//   {
//     name: "Christine",
//     content: "No, no! It talked to me..",
//   },
//   {
//     name: "Suicide Maid",
//     content: "You made me do this.",
//   },
//   {
//     name: "April",
//     content:
//       "When the music stops, you'll see him in the mirror standin' behind you.",
//   },
//   {
//     name: "Cindy",
//     content:
//       "There's a lady in a dirty night gown, that I see in my dreams, she's standin' in front of my mom's bed.",
//   },
//   {
//     name: "Ed Warren",
//     content:
//       "It was big mistake, acknowledging this doll. Though it. The inhuman spirit tricked you..",
//   },
//   {
//     name: "Roger Perron",
//     content: "I don't know what you are! But you leave my wife alone damn you!",
//   },
//   {
//     name: "Bathsheba",
//     content: "She's already gone.. And now your all gonna die",
//   },
//   {
//     name: "Ed Warren",
//     content: "Sometimes it's better to keep the genie in the bottle",
//   },
//   {
//     name: "Drew",
//     content: "You can't shoot a ghost.",
//   },
// ];
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// const getIds = async () => {
//   let results = await knex("flims").select("id").whereRaw("info->>'name' = ''");
//   results = results.map((item) => item.id);
//   await knex("flims").whereIn("id", results).del();
//   results = await knex("flims").select("id").whereRaw("info->>'name' = ''");
//   console.log("🚀 -----------------------------");
//   console.log("🚀 ~ getIds ~ results", results);
//   console.log("🚀 -----------------------------");
// };

// const getIds = async () => {
//   let results = await knex("flims").select("id", "what_to_knows");
//   results = results
//     .filter((item) => item.what_to_knows.length === 0)
//     .map((item) => item.id);
//   await knex("flims")
//     .whereIn("id", results)
//     .update({
//       what_to_knows: [
//         {
//           title: "critics consensus",
//           content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel metus gravida tellus iaculis ullamcorper et ut nisl. Sed sollicitudin neque a sem fermentum, at viverra leo viverra. Donec feugiat dapibus ipsum eget condimentum. Curabitur sed posuere mauris. Morbi condimentum lobortis nunc, id lobortis odio interdum sed. Sed ipsum turpis, vestibulum sed dui sed, dapibus volutpat nisi. Fusce vehicula dolor eu nisl tempus tincidunt. Quisque id urna sagittis, lobortis risus non, ultricies massa. Aliquam enim eros, auctor at lacus nec, venenatis finibus mi. Quisque fringilla elit eget est facilisis sollicitudin. Ut bibendum, est eget consequat laoreet, sem libero consectetur libero, quis gravida diam metus non dolor. Etiam quis nibh aliquet, vehicula mi ac, suscipit erat. Aliquam facilisis at massa id ornare. In id tortor vel massa tempus semper. Maecenas accumsan nulla massa, quis tincidunt urna cursus ac. Sed risus justo, imperdiet non auctor sed, accumsan eget dui.",
//         },
//       ],
//     });
// };

// const getIds = async () => {
//   let results = await knex("flims").select("id", "streamings");
//   results = results
//     .filter((item) => item.streamings.length === 0)
//     .map((item) => item.id);
//   await knex("flims")
//     .whereIn("id", results)
//     .update({
//       streamings: ["netflix", "amazon-prime-video-us"],
//     });
// };

// const getIds = async () => {
//   let results = await knex("flims").select();
//   let backItem = results[0];
//   for (const item of results) {
//     if (!item.info.rating || item.info.rating.length === 0)
//       item.info.rating = "PG-13";
//     if (!item.info.summary || item.info.summary.length === 0)
//       item.info.summary = faker.commerce.productDescription();
//     if (!item.info.genres || item.info.genres.length === 0)
//       item.info.genres = ["unknown"];
//     if (
//       !item.info.original_language ||
//       item.info.original_language.length === 0
//     )
//       item.info.original_language = "English";
//     if (!item.info.theaters_date || item.info.theaters_date.length === 0)
//       item.info.theaters_date = backItem.info.theaters_date || "Jan 29, 2023";
//     if (!item.info.streaming_date || item.info.streaming_date.length === 0)
//       item.info.streaming_date = backItem.info.streaming_date || "Jan 29, 2023";
//     if (!item.info.productions || item.info.productions.length === 0)
//       item.info.productions = backItem.info.productions || ["Lemoncat"];
//     if (!item.info.sound_mixs || item.info.sound_mixs.length === 0)
//       item.info.sound_mixs = backItem.info.sound_mixs || ["Dolby Digital"];
//     if (!item.info.aspect_ratio || item.info.aspect_ratio.length === 0)
//       item.info.aspect_ratio = backItem.info.aspect_ratio || "Flat (1.85:1)";
//     if (!item.info.collection || item.info.collection.length === 0)
//       item.info.collection = "";
//     if (!item.info.runtime || item.info.runtime.length === 0)
//       item.info.runtime = "2h";
//     if (!item.info.poster || item.info.poster.length === 0)
//       item.info.poster =
//         "http://imd.icom.museum/wp-content/uploads/sites/54/2021/01/IMD_2021_POSTER_EN-683x1024.jpg";
//     if (!item.photos || item.photos.length === 0)
//       item.photos = deepClone(photos);
//     item.quotes = deepClone(quotes);
//     if (!item.crawl_data.audience || item.crawl_data.audience.length === 0)
//       item.crawl_data.audience_state = "";
//     if (!item.data) item.data = {};
//     if (!item.data.trailer_photo || item.data.trailer_photo.length === 0)
//       item.data.trailer_photo =
//         "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-movies-1614634680.jpg";
//     backItem = deepClone(item);
//     await knex("flims").where("id", item.id).update(item);
//   }
//   console.log(">>>>>>>>>>");
// };

// getIds();

const restruct = async () => {
  let flimUrlResults = [];
  const flims = await knex("flims").select("crews");
  for (const item of flims) {
    flimUrlResults = [
      ...flimUrlResults,
      ...item.crews.map((item) => item.person),
    ];
  }
  flimUrlResults = _.uniq(flimUrlResults); //30085
  let personsUrlResults = [];
  const persons = await knex("persons").select("crawl_data");
  for (const item of persons) {
    personsUrlResults.push(item.crawl_data.url); //28923
  }
  const different = _.difference(flimUrlResults, personsUrlResults);
  for (const item of different) {
    await fs.appendFileSync("miss-link.txt", item + "\n", "utf8");
  }
  console.log("DONE");
};

restruct();
