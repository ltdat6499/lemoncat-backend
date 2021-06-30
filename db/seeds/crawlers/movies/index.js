// const fs = require("fs");
// const axios = require("axios");
// const readline = require("readline");
// const cheerio = require("cheerio");
// const knex = require("../../../../controllers/knex");

// // const { Builder, until } = require("selenium-webdriver");
// // const fetchData = async (url) => {
// //   let driver = new Builder()
// //     .forBrowser("firefox")
// //     .usingServer("http://localhost:4444/wd/hub")
// //     .build();
// //   await driver.get(url);
// //   await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
// //   const result = await driver.getPageSource();
// //   await driver.quit();
// //   return cheerio.load(result);
// // };

// // const crawler = async () => {
// //   const links = await loadArray();

// //   for (const link of links) {
// //     const $ = await fetchData(link);
// //     const data = await getPersons(link, $);
// //     await fs.appendFileSync(
// //       "results.txt",
// //       JSON.stringify(data) + "\n",
// //       "utf8"
// //     );
// //     console.log(data.crawl_data.url);
// //   }
// // };

// // const moment = require("moment");
// // const flims = require("../../../controllers/flims");
// // const detachMovieInfoList = (data) => {
// //   const result = {};
// //   for (const item of data) {
// //     const splitItem = item.split(": ");
// //     if (splitItem && splitItem.length === 2) {
// //       if (splitItem.includes("Genre")) {
// //         result.genres = splitItem[1].split(", ");
// //       } else if (splitItem.includes("Original Language")) {
// //         result.original_language = splitItem[1];
// //       } else if (splitItem.includes("Release Date (Theaters)")) {
// //         result.theaters_date = splitItem[1];
// //       } else if (splitItem.includes("Release Date (Streaming)")) {
// //         result.streaming_date = splitItem[1];
// //       } else if (splitItem.includes("Box Office")) {
// //         result.box_office = splitItem[1];
// //       } else if (splitItem.includes("Runtime")) {
// //         result.runtime = splitItem[1].split(", ");
// //       } else if (splitItem.includes("Production")) {
// //         result.productions = splitItem[1].split(", ");
// //       } else if (splitItem.includes("Sound Mix")) {
// //         result.sound_mixs = splitItem[1].split(", ");
// //       } else if (splitItem.includes("Aspect Ratio")) {
// //         result.aspect_ratio = splitItem[1];
// //       } else if (splitItem.includes("View the collection")) {
// //         result.collection = splitItem[1];
// //       }
// //     }
// //   }
// //   return result;
// // };
// // const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// const fetchData = async (url) => {
//   try {
//     let response;
//     response = await axios({
//       url,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.log("Axios error");
//     console.log(">>>>>>>>>>");
//     console.log(error);
//     console.log(">>>>>>>>>>");
//   }
// };
// const base = [
//   "div[class='body_main container']",
//   "div[id='main_container']",
//   "section[class='mob-body ']",
//   "div[id='mainColumn']",
// ];
// const path = {
//   name: base.concat([
//     "div[id='topSection']",
//     "score-board[class='scoreboard']",
//     "h1[class='scoreboard__title']",
//   ]),
//   rating: base.concat([
//     "div[id='topSection']",
//     "score-board[class='scoreboard']", //attr: rating
//   ]),
//   summary: base.concat([
//     "section[class='panel panel-rt panel-box movie_info media']",
//     "div[class='media-body']",
//     "div[class='panel-body content_body']",
//     "div[id='movieSynopsis']",
//   ]),
//   genres_runtime: base.concat([
//     "section[class='panel panel-rt panel-box movie_info media']",
//     "div[class='media-body']",
//     "div[class='panel-body content_body']",
//     "ul[class='content-meta info'] > li",
//   ]),
//   poster: base.concat([
//     "div[id='topSection']",
//     "div[class='movie-thumbnail-wrap']",
//     "div[class='center'] > a[id='poster_link'] > img", //srcset
//   ]),
//   what_to_knows: base.concat([
//     "div[id='topSection']",
//     "section[id='where-to-know']",
//     "div[class='what-to-know__body'] > section",
//   ]),
//   streamings: base.concat([
//     "div[id='topSection']",
//     "section[id='where-to-watch']",
//     "div[class='where-to-watch__body']",
//     "ul[class='affiliates__list js-affiliates-list'] > li > a", //data-affiliate
//   ]),
//   photos: base.concat([
//     "section[class='panel panel-rt panel-box']",
//     "div[class='panel-body content_body allow-overflow']",
//     "div[id='photos-carousel-root']",
//     "div[class='Carousel PhotosCarousel']",
//     "div[class='preload']",
//     "div[class='PhotosCarousel__item']",
//     "a[class='PhotosCarousel__item-link'] > img",
//   ]),
//   crews: base.concat([
//     "section[id='movie-cast']",
//     "div[class='panel-body content_body']",
//     "div[class='castSection '] > div",
//   ]),
// };
// // const trailerPhoto = base.concat([
// //   "hero-image > button > hero-image-poster > div[class='js-lazyLoad']",
// // ]);
// // const alsoLike = base.concat([
// //   "div[id='topSection']",
// //   "section[id='you-might-like']",
// //   "div[class='recommendations-panel__content--movie']",
// //   "tiles-carousel",
// //   "div[class='posters-container']",
// //   "a[class='recommendations-panel__poster-link']",
// // ]);
// // const news = base.concat([
// //   "section[id='newsSection']",
// //   "div[class='panel-body content_body']",
// //   "div[class='news-article-wrap  ']",
// //   "div[class='news-article'] > a",
// // ]);

// // const getMaxPage = async (url) => {
// //   const page = [
// //     "div[class='body_main container']",
// //     "div[id='main_container']",
// //     "div[class='col col-center-right col-full-xs']",
// //     "section[id='content']",
// //     "div[class='panel-body content_body reviews-content']",
// //     "div[class='reviews-movie']",
// //     "div[class='content'] > div > span[class='pageInfo']",
// //   ];
// //   try {
// //     const data = await fetchData(
// //       url + "/reviews?type=top_critics&sort=&page=1"
// //     );
// //     const $ = cheerio.load(data);
// //     let max = 0;
// //     $("body")
// //       .find(page.join(" > "))
// //       .each((i, el) => {
// //         max = $(el).text().trim().split("of ")[1];
// //       });
// //     return parseInt(max);
// //   } catch (error) {
// //     return 0;
// //   }
// // };

// // const critics = async (url, type) => {
// //   const top = "/reviews?type=top_critics&sort=&page=";
// //   const all = "/reviews?type=&sort=&page=";
// //   let current = all;
// //   if (type === "top") current = top;
// //   const thisBase = [
// //     "div[class='body_main container']",
// //     "div[id='main_container']",
// //     "div[class='col col-center-right col-full-xs']",
// //     "section[id='content']",
// //     "div[class='panel-body content_body reviews-content']",
// //     "div[class='reviews-movie']",
// //     "div[class='content']",
// //     "div[class='review_table']",
// //     "div[class='row review_table_row']",
// //   ];
// //   const thisSkeleton = {
// //     image: "",
// //     name: "",
// //     working: "",
// //     content: "",
// //     date: "",
// //     url: "",
// //     score: "",
// //   };
// //   const results = [];
// //   const max = await getMaxPage(url);
// //   let list = [];
// //   for (let i = 1; i <= max; i++) {
// //     list.push(i);
// //   }
// //   for await (const i of list) {
// //     try {
// //       const data = await fetchData(url + current + i);
// //       const $ = cheerio.load(data);
// //       $("body")
// //         .find(thisBase.join(" > "))
// //         .each((i, el) => {
// //           const result = deepClone(thisSkeleton);
// //           result.image = $(el)
// //             .find(
// //               [
// //                 "div[class='col-xs-8 critic-info']",
// //                 "div[class='col-sm-7 col-xs-16 critic_img'] > img",
// //               ].join(" > ")
// //             )
// //             .attr("src");
// //           result.name = (
// //             $(el)
// //               .find(
// //                 [
// //                   "div[class='col-xs-8 critic-info']",
// //                   "div[class='col-sm-17 col-xs-32 critic_name']",
// //                   "a[class='unstyled bold articleLink']",
// //                 ].join(" > ")
// //               )
// //               .text() || "No Name"
// //           ).trim();
// //           result.working = (
// //             $(el)
// //               .find(
// //                 [
// //                   "div[class='col-xs-8 critic-info']",
// //                   "div[class='col-sm-17 col-xs-32 critic_name']",
// //                   "a > em[class='subtle critic-publication']",
// //                 ].join(" > ")
// //               )
// //               .text() || "No News"
// //           ).trim();
// //           result.content = (
// //             $(el)
// //               .find(
// //                 [
// //                   "div[class='col-xs-16 review_container']",
// //                   "div[class='review_area']",
// //                   "div[class='review_desc']",
// //                   "div[class='the_review']",
// //                 ].join(" > ")
// //               )
// //               .text() ||
// //             "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
// //           ).trim();
// //           result.date = (
// //             $(el)
// //               .find(
// //                 [
// //                   "div[class='col-xs-16 review_container']",
// //                   "div[class='review_area']",
// //                   "div[class='review-date subtle small']",
// //                 ].join(" > ")
// //               )
// //               .text() || "April 14, 2021"
// //           ).trim();
// //           result.url = $(el)
// //             .find(
// //               [
// //                 "div[class='col-xs-16 review_container']",
// //                 "div[class='review_area']",
// //                 "div[class='review_desc']",
// //                 "div[class='small subtle review-link'] > a",
// //               ].join(" > ")
// //             )
// //             .attr("href");
// //           result.score = (
// //             $(el)
// //               .find(
// //                 [
// //                   "div[class='col-xs-16 review_container']",
// //                   "div[class='review_area']",
// //                   "div[class='review_desc']",
// //                   "div[class='small subtle review-link']",
// //                 ].join(" > ")
// //               )
// //               .text() || "Full Review | Original Score: 5/10"
// //           )
// //             .trim()
// //             .replace(/\s\s+/g, " ");
// //           if (result.score.length > 14)
// //             result.score = result.score.split(" | ")[1];
// //           else {
// //             result.score = "Original Score: 5/10";
// //           }
// //           results.push(result);
// //         });
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   }
// //   return results;
// // };

// // const skeleton = {
// //   type: "movie",
// //   info: {
// //     name: "",
// //     trailer: "https://www.youtube.com/embed/a-qiMS8fnV4",
// //     summary: "",
// //     poster: "",
// //     tags: [],
// //   },
// //   slug: "",
// //   what_to_knows: [
// //     // {
// //     //   title: "String",
// //     //   content: "String",
// //     // },
// //   ],
// //   streamings: [],
// //   photos: [],
// //   crews: [
// //     // {
// //     //   person: "url",
// //     //   role: "giam doc san xuat || Tony Stark || bien kich",
// //     // },
// //   ],
// //   data: {
// //     trailer_photo: "",
// //     also_like: [],
// //     news: [],
// //     reviews: {
// //       top_critics: [
// //         // {
// //         //   image: "",
// //         //   name: "",
// //         //   workingFor: "",
// //         //   content: "",
// //         //   date: "",
// //         //   score: "",
// //         //   url: "",
// //         // },
// //       ],
// //       critics: [
// //         // {
// //         //   content: "",
// //         //   date: "",
// //         //   score: "",
// //         //   url: "",
// //         // },
// //       ],
// //     },
// //   },
// //   quotes: [],
// //   crawl_data: {},
// // };

// const crawl = async (url) => {
//   try {
//     const data = await fetchData(url);
//     const $ = cheerio.load(data);
//     const result = $("body")
//       .find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//           "div[class='col mob col-center-right col-full-xs mop-main-column']",
//           "div[id='topSection']",
//           "div[class='movie-thumbnail-wrap']",
//           "div[class='center']",
//           "img",
//         ].join(" > ")
//       )
//       .attr("data-src");
//     console.log(
//       $("body").find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//           "div[class='col mob col-center-right col-full-xs mop-main-column']",
//           "div[id='topSection']",
//           "div[class='movie-thumbnail-wrap']",
//           "div[class='center']",
//           "img",
//         ].join(" > ")
//       ).length
//     );
//     console.log(
//       $("body").find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//           "div[class='col mob col-center-right col-full-xs mop-main-column']",
//           "div[id='topSection']",
//           "div[class='movie-thumbnail-wrap']",
//           "div[class='center']",
//         ].join(" > ")
//       ).length
//     );
//     console.log(
//       $("body").find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//           "div[class='col mob col-center-right col-full-xs mop-main-column']",
//           "div[id='topSection']",
//           "div[class='movie-thumbnail-wrap']",
//         ].join(" > ")
//       ).length
//     );
//     console.log(
//       $("body").find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//           "div[class='col mob col-center-right col-full-xs mop-main-column']",
//           "div[id='topSection']",
//         ].join(" > ")
//       ).length
//     );
//     console.log(
//       $("body").find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//           "div[class='col mob col-center-right col-full-xs mop-main-column']",
//         ].join(" > ")
//       ).length
//     );
//     console.log(
//       $("body").find(
//         [
//           "div[class='body_main container']",
//           "div[class='container']",
//           "section[class='mob-body ']",
//         ].join(" > ")
//       ).length
//     );
//     console.log(
//       $("body").find(
//         ["div[class='body_main container']", "div[class='container']"].join(
//           " > "
//         )
//       ).length
//     );
//     console.log(
//       $("body").find(["div[class='body_main container']"].join(" > ")).length
//     );
//     // const result = deepClone(skeleton);

//     // result.crawl_data.audience_state = $("body")
//     //   .find(path.rating.join(" > "))
//     //   .attr("audiencestate");
//     // result.crawl_data.audience_score = $("body")
//     //   .find(path.rating.join(" > "))
//     //   .attr("audiencescore");
//     // result.crawl_data.tomatometer_state = $("body")
//     //   .find(path.rating.join(" > "))
//     //   .attr("tomatometerstate");
//     // result.crawl_data.tomatometer_score = $("body")
//     //   .find(path.rating.join(" > "))
//     //   .attr("tomatometerscore");
//     // result.info.name = $("body").find(path.name.join(" > ")).text().trim();
//     // result.info.rating = $("body").find(path.rating.join(" > ")).attr("rating");
//     // result.info.summary = (
//     //   $("body").find(path.summary.join(" > ")).text() ||
//     //   "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
//     // ).trim();
//     // const movieInfoList = [];
//     // $("body")
//     //   .find(path.genres_runtime.join(" > "))
//     //   .each((i, el) => {
//     //     movieInfoList.push($(el).text().trim().replace(/\s\s+/g, " "));
//     //   });
//     // result.info = { ...result.info, ...detachMovieInfoList(movieInfoList) };
//     // result.slug = url.replace("https://www.rottentomatoes.com/m/", "");
//     // $("body")
//     //   .find(path.what_to_knows.join(" > "))
//     //   .each((i, el) => {
//     //     result.what_to_knows.push({
//     //       title: $(el).find("h3").text().trim(),
//     //       content: $(el).find("p").text().trim().replace(/\s\s+/g, " "),
//     //     });
//     //   });
//     // $("body")
//     //   .find(path.streamings.join(" > "))
//     //   .each((i, el) => {
//     //     result.streamings.push($(el).attr("data-affiliate"));
//     //   });
//     // $("body")
//     //   .find(path.photos.join(" > "))
//     //   .each((i, el) => {
//     //     result.photos.push($(el).attr("data-src"));
//     //   });
//     // $("body")
//     //   .find(path.crews.join(" > "))
//     //   .each((i, el) => {
//     //     const crewUrl = $(el).find("div > a").attr("href");
//     //     if (crewUrl) {
//     //       const role = $(el).find("div > span").text();
//     //       if (role && role.length) {
//     //         result.crews.push({
//     //           person: "https://www.rottentomatoes.com" + crewUrl,
//     //           role: role.trim().replace(/\s\s+/g, " "),
//     //         });
//     //       }
//     //     }
//     //   });
//     // result.data.trailer_photo = (
//     //   $("body").find(trailerPhoto.join(" > ")).attr("data-bg-srcset") ||
//     //   "s, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-movies-1614634680.jpg"
//     // )
//     //   .split(", ")
//     //   .reverse()[0];
//     // $("body")
//     //   .find(alsoLike.join(" > "))
//     //   .each((i, el) => {
//     //     result.data.also_like.push(
//     //       "https://www.rottentomatoes.com" +
//     //         ($(el).attr("href") || "/m/avengers_endgame")
//     //     );
//     //   });
//     // $("body")
//     //   .find(news.join(" > "))
//     //   .each((i, el) => {
//     //     result.data.news.push({
//     //       url: $(el).attr("href"),
//     //       title: (
//     //         $(el).find("div[class='news-article-title']").text() || "No title"
//     //       ).trim(),
//     //     });
//     //   });
//     // result.data.reviews.top_critics = await critics(url, "top");
//     // result.data.reviews.critics = await critics(url, "all");
//     return result;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const loadArray = async () => {
//   const file = fs.createReadStream("result.txt");

//   const readLine = readline.createInterface({
//     input: file,
//     crlfDelay: Infinity,
//   });
//   const results = [];
//   for await (const line of readLine) {
//     results.push(line);
//   }
//   return results.reverse();
// };

// const run = async () => {
//   const ids = await loadArray();
//   for (const id of ids) {
//     const data = await knex("flims").select("info").where({ id }).first();
//     data.info.poster = "https://allmovies.tube/assets/img/no-poster.png";
//     await knex("flims").update({ info: data.info }).where({ id });
//   }
//   console.log("done");
// };

// run();
