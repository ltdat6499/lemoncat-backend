const fs = require("fs");
const readline = require("readline");
const knex = require("../../../controllers/knex");

const moment = require("moment");
const _ = require("lodash");
// const interacts = ["love", "care", "wow", "like", "dislike", "angry"];
// const getRandomInt = (min, max) => {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };
// const fs = require("fs");

const loadArray = async () => {
  const file = fs.createReadStream("roles.txt");

  const readLine = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of readLine) {
    results.push(line);
  }
  return results.reverse();
};
// const tagsString =
//   "game-of-thrones FirstLook werewolf Spectrum Originals DC Comics GLAAD CBS All Access laika anthology adaptation GIFs TNT hist Tarantino 007 TCM ghosts justice league 2016 El Rey zombie TCA Winter 2020 Super Bowl Amazon Studios series MCU Disney The Academy festival Endgame Film Festival Best and Worst NBC IFC Films parents Emmy Nominations stop motion jurassic park TV renewals Teen Turner Classic Movies criterion Toys BBC One finale Food Network popular documentary A24 IFC Trivia kids Pop stand-up comedy science fiction cats Holidays cancelled television book adaptation richard e. Grant child's play 2021 Disney Channel The CW Dark Horse Comics Crunchyroll directors superman Legendary Tumblr comiccon Television Critics Association binge worst movies facebook Paramount Network Action boxoffice mission: impossible Mary Poppins Returns Reality disaster NYCC cancelled APB Creative Arts Emmys spain social media Universal Calendar BAFTA E3 Premiere Dates Exclusive Video australia period drama composers The Arrangement hispanic SundanceTV children's TV medical drama 72 Emmy Awards Classic Film Fall TV San Diego Comic-Con indie singing competition cults unscripted FX rotten movies we love know your critic festivals worst christmas movies travel PlayStation award winner reviews DGA Comic Book video on demand WGN boxing Writers Guild of America Sneak Peek Set visit FOX strong female leads Box Office Avengers hollywood canceled TV shows MSNBC ITV The Walking Dead 20th Century Fox universal monsters a nightmare on elm street asian-american Awards Tour Discovery Channel women Fox News Logo Fantasy Watching Series E! YA toronto Baby Yoda Tubi 93rd Oscars Ghostbusters dramedy cancelled TV shows Tomatazos sequels Warner Bros. high school Oscars marvel cinematic universe Opinion diversity Rock japanese nfl Amazon Prime Video Spring TV kaiju The Witch war Countdown TV One Family zombies joker news tv talk aapi LGBT crime Lifetime Christmas movies Winners emmy awards live action revenge DC streaming service cancelled TV series 2019 Masterpiece dceu godzilla TBS mockumentary Academy Awards teaser Anna Paquin Hulu dogs Apple TV Red Carpet docudrama twilight police drama game show Valentine's Day Reality Competition Amazon Prime Animation blaxploitation pirates of the caribbean spy thriller talk show comedies TruTV Black History Month elevated horror Acorn TV movie historical drama vampires casting Television Academy video new star wars movies TCA Esquire Sci-Fi Crackle stoner serial killer 78th Annual Golden Globe Awards SXSW doctor who VICE Superheroes Cannes foreign 21st Century Fox YouTube adventure king kong golden globes Nickelodeon Schedule scary movies Photos Starz Certified Fresh based on movie heist movie comic thriller spanish language chucky Emmys Black Mirror Martial Arts new york Music crime drama james bond Heroines Columbia Pictures supernatural what to watch YouTube Red Disney Plus psychological thriller Trailer 4/20 Elton John GoT Cosplay See It Skip It ratings ESPN First Reviews Netflix Christmas movies TLC all-time Comedy obituary AMC Musical Ovation USA Network Comedy Central nbcuniversal sitcom Brie Larson Apple TV Plus critics renewed TV shows RT History VH1 PBS Biopics Nominations 2015 Funimation 2020 green book Adult Swim X-Men psycho Summer crime thriller MTV black politics latino robots rt archives Quiz Star Wars lord of the rings Character Guide Western mutant ABC Family President Star Trek Disney+ Disney Plus natural history french ViacomCBS Travel Channel Freeform Britbox BBC America Spike RT21 theme song indiana jones CNN OWN south america Holiday fresh superhero nature anime Women's History Month transformers Lucasfilm Nat Geo hidden camera Chernobyl classics versus blockbuster sequel Lifetime kong Peacock Marvel spanish discovery franchise cars Polls and Games Binge Guide streaming Hear Us Out dark Pacific Islander Podcast History Unbreakable Kimmy Schmidt Marathons documentaries cooking PaleyFest Rocketman spider-man Hallmark Christmas movies razzies die hard comics cartoon animated Pop TV Shudder FXX football canceled Mudbound Video Games Syfy true crime Apple TV+ witnail screen actors guild jamie lee curtis TIFF Pixar Sundance TV name the review sports Pride Month slashers Year in Review ABC Signature Drama 99% New York Comic Con YouTube Premium reboot American Society of Cinematographers spinoff DC Universe Fox Searchlight dc TCA 2017 Amazon OneApp italian golden globe awards Showtime DirecTV biography HBO docuseries Chilling Adventures of Sabrina Sundance Paramount Thanksgiving television concert best Walt Disney Pictures BET fast and furious Netflix 71st Emmy Awards remakes Winter TV CMT The Purge Pirates monster movies Extras movies venice TCA Awards scene in color deadpool National Geographic Mary Tyler Moore Pet Sematary 2017 HBO Max cops ID 2018 Disney streaming service Christmas sag awards scorecard political drama WarnerMedia Broadway Country 45 Election prank Captain marvel breaking bad dragons Grammys Marvel Television Shondaland miniseries Paramount Plus Sony Pictures blockbusters Sundance Now 24 frames romance Mindy Kaling FX on Hulu target Arrowverse BET Awards HBO Go Comics on TV quibi Lionsgate free movies Vudu Ellie Kemper Alien Stephen King Horror international USA VOD batman Superheroe Hallmark films technology screenings zero dark thirty ABC archives LGBTQ rotten satire halloween tv independent trailers Trophy Talk harry potter Epix rom-coms comic books saw Rocky cinemax The Walt Disney Company Song of Ice and Fire Infographic Marvel Studios halloween Mary poppins crossover A&E Cartoon Network BBC aliens Interview toy story Kids & Family CW Seed SDCC book Bravo Mystery Film Turner telelvision space Awards CBS TV Land romantic comedy Musicals Rom-Com";
// const tags = tagsString.split(" ");

// const run = async () => {
//   let flims = await knex("flims").select("id", "updated_at");
//   for (const item of flims) {
//     if (!moment(item.updated_at).startOf("day").fromNow().includes("ago")) {
//       let posts = await knex("posts")
//         .select("id")
//         .where({ type: "reviews" })
//         .andWhereRaw("cast(data->>'flim' as TEXT) = ?", [item.id]);
//       posts = posts.map((post) => post.id);

//       for (const post of posts) {
//         const postInteracts = await knex("actions")
//           .select("id")
//           .where({ type: "interacts", parent_type: "post", parent: post });
//         await knex("actions")
//           .whereIn(
//             "id",
//             postInteracts.map((item) => item.id)
//           )
//           .del();
//         console.log(postInteracts);

//         const postComments = await knex("actions")
//           .select("id")
//           .where({ type: "comment", parent_type: "post", parent: post });

//         for (const { id: postComment } of postComments) {
//           const commentInteracts = await knex("actions").select("id").where({
//             type: "interacts",
//             parent_type: "comment",
//             parent: postComment,
//           });

//           await knex("actions")
//             .whereIn(
//               "id",
//               commentInteracts.map((item) => item.id)
//             )
//             .del();
//           console.log(commentInteracts);
//         }

//         for (const { id: postComment } of postComments) {
//           const childComments = await knex("actions").select("id").where({
//             type: "comment",
//             parent_type: "comment",
//             parent: postComment,
//           });

//           for (const childComment of childComments.map((item) => item.id)) {
//             const childInteracts = await knex("actions").select("id").where({
//               type: "interacts",
//               parent_type: "comment",
//               parent: childComment,
//             });
//             await knex("actions")
//               .whereIn(
//                 "id",
//                 childInteracts.map((item) => item.id)
//               )
//               .del();
//             console.log(childInteracts);
//           }

//           await knex("actions")
//             .whereIn(
//               "id",
//               childComments.map((item) => item.id)
//             )
//             .del();
//           console.log(childComments);
//         }

//         await knex("actions")
//           .whereIn(
//             "id",
//             postComments.map((item) => item.id)
//           )
//           .del();
//         console.log(postComments);
//       }
//     }
//   }
//   console.log("DONE");
// };

const run = async () => {
  let posts =
    `47675240760891 47675240686124 47675240679979 47675240738357 47675240698415 47675240702512 47675240712753 47675240628772 47675240631845 47675240635942 47675240639015 47675240643112 47675240661545 47675240676906 47675240695342 47675240691245 47675240620578 47675240624675 47675240766012 47675240757818 47675240772157 47675240744503`.split(
      " "
    );

  // for (const post of posts) {
  //   const postInteracts = await knex("actions")
  //     .select("id")
  //     .where({ type: "interacts", parent_type: "post", parent: post });
  //   await knex("actions")
  //     .whereIn(
  //       "id",
  //       postInteracts.map((item) => item.id)
  //     )
  //     .del();
  //   console.log(postInteracts);

  //   const postComments = await knex("actions")
  //     .select("id")
  //     .where({ type: "comment", parent_type: "post", parent: post });

  //   for (const { id: postComment } of postComments) {
  //     const commentInteracts = await knex("actions").select("id").where({
  //       type: "interacts",
  //       parent_type: "comment",
  //       parent: postComment,
  //     });

  //     await knex("actions")
  //       .whereIn(
  //         "id",
  //         commentInteracts.map((item) => item.id)
  //       )
  //       .del();
  //     console.log(commentInteracts);
  //   }

  //   for (const { id: postComment } of postComments) {
  //     const childComments = await knex("actions").select("id").where({
  //       type: "comment",
  //       parent_type: "comment",
  //       parent: postComment,
  //     });

  //     for (const childComment of childComments.map((item) => item.id)) {
  //       const childInteracts = await knex("actions").select("id").where({
  //         type: "interacts",
  //         parent_type: "comment",
  //         parent: childComment,
  //       });
  //       await knex("actions")
  //         .whereIn(
  //           "id",
  //           childInteracts.map((item) => item.id)
  //         )
  //         .del();
  //       console.log(childInteracts);
  //     }

  //     await knex("actions")
  //       .whereIn(
  //         "id",
  //         childComments.map((item) => item.id)
  //       )
  //       .del();
  //     console.log(childComments);
  //   }

  //   await knex("actions")
  //     .whereIn(
  //       "id",
  //       postComments.map((item) => item.id)
  //     )
  //     .del();
  //   console.log(postComments);
  // }
  await knex("posts").whereIn("id", posts).del();
  console.log(posts);
  console.log("DONE");
};

const checkTags = (tag) => {
  if (
    tag.toLowerCase().includes("the avengers") ||
    tag.toLowerCase().includes("doctor strange") ||
    tag.toLowerCase().includes("ant-man") ||
    tag.toLowerCase().includes("thanos")
  )
    return true;
  return false;
};

const setTags = async () => {
  const results = [];
  const flims = await knex("flims").select("id", "info", "data");
  for (const item of flims) {
    if (checkTags(item.info.name) || checkTags(item.info.summary)) {
      item.info.tags.push("hero");
    }
    item.info.tags = _.uniq(item.info.tags);
    if (item.info.tags.length > 0)
      results.push({ id: item.id, info: item.info });
  }
  for (const item of results) {
    await knex("flims").update({ info: item.info }).where({ id: item.id });
  }
  console.log("PUSH DONE");
};

const resetTags = async () => {
  const flims = await knex("flims").select("id", "info");
  for (const item of flims) {
    await knex("flims")
      .update({ info: { ...item.info, ...{ tags: [] } } })
      .where({ id: item.id });
  }
  console.log("RESET DONE");
};

const checkDistinctStreamings = async () => {
  const flims = await knex("flims").select("streamings");
  let results = [];
  for (const flim of flims) {
    results = results.concat(flim.streamings);
    results = _.uniq(results);
  }
  console.log(results);
};

const updatePersonsImage = async () => {
  const results = await knex("persons").select("id", "images");
  for (const item of results) {
    if (item.images && item.images.length > 0) {
      if (
        item.images[0] == null ||
        item.images[0].includes(
          "/assets/pizza-pie/images/poster_default.c8c896e70c3.gif"
        )
      ) {
        item.images[0] =
          "https://i.pinimg.com/originals/12/a1/a7/12a1a70d052a487a185c01c25b71a09e.jpg";
        await knex("persons")
          .update({ images: item.images })
          .where({ id: item.id });
      }
    }
  }
  console.log("DONE");
};

const getDistintRole = async () => {
  // const results = await knex("flims").select("crews");
  // for (const item of results) {
  //   for (const iterator of item.crews) {
  //     await fs.appendFileSync(`roles.txt`, iterator.role + "\n", "utf8");
  //   }
  // }
  let results = await loadArray();
  // const distintResults = _.uniq(results);
  // const finalResults = [];
  // for (const item of distintResults) {
  //   if (results.filter((i) => i === item).length >= 2) finalResults.push(item);
  // }
  await fs.writeFileSync(
    `roles.txt`,
    JSON.stringify({ data: results }),
    "utf8"
  );
  console.log("done");
};
// Director Screenwriter  Producer Cinematographer Production Design
// Film Editor Original Music 'Casting' 'Art' 'Set Decoration' 'Key Makeup Artist'
// Unit Manager Sound Mixer Costume Designer Assistant

const getDistintGenres = async () => {
  let results = await knex("flims").select("info");
  results = results.map((item) => item.info.genres);
  let finalResults = [];
  for (const item of results) {
    for (const iterator of item) {
      finalResults.push(iterator);
    }
  }
  finalResults = _.uniq(finalResults);
  await fs.writeFileSync(`roles.txt`, finalResults.join("\n"), "utf8");
  console.log("done");
};

const mapping = async () => {
  const results = await knex("posts")
    .select("id", "slug")
    .where({ type: "review" });
  // for (const item of results) {
  //   await knex("posts")
  //     .update({ slug: item.slug + "-" + item.id })
  //     .where({ id: item.id });
  // }
  // const distintResults = await knex("posts")
  //   .select("id", "slug")
  //   .distinctOn("slug")
  //   .where({ type: "review" });
  // console.log("🚀 ------------------------------");
  // console.log(
  //   "🚀 ~ mapping ~ results",
  //   distintResults.length,
  //   fullResults.length
  // );
  // console.log("🚀 ------------------------------");

  console.log("done");
};
