const knex = require("./controllers/knex");
const moment = require("moment");
const _ = require("lodash");
const interacts = ["love", "care", "wow", "like", "dislike", "angry"];
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const fs = require("fs");
const readline = require("readline");

// const loadArray = async () => {
//   const file = fs.createReadStream("_comments__202106261307.txt");

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
// const tagsString =
//   "game-of-thrones FirstLook werewolf Spectrum Originals DC Comics GLAAD CBS All Access laika anthology adaptation GIFs TNT hist Tarantino 007 TCM ghosts justice league 2016 El Rey zombie TCA Winter 2020 Super Bowl Amazon Studios series MCU Disney The Academy festival Endgame Film Festival Best and Worst NBC IFC Films parents Emmy Nominations stop motion jurassic park TV renewals Teen Turner Classic Movies criterion Toys BBC One finale Food Network popular documentary A24 IFC Trivia kids Pop stand-up comedy science fiction cats Holidays cancelled television book adaptation richard e. Grant child's play 2021 Disney Channel The CW Dark Horse Comics Crunchyroll directors superman Legendary Tumblr comiccon Television Critics Association binge worst movies facebook Paramount Network Action boxoffice mission: impossible Mary Poppins Returns Reality disaster NYCC cancelled APB Creative Arts Emmys spain social media Universal Calendar BAFTA E3 Premiere Dates Exclusive Video australia period drama composers The Arrangement hispanic SundanceTV children's TV medical drama 72 Emmy Awards Classic Film Fall TV San Diego Comic-Con indie singing competition cults unscripted FX rotten movies we love know your critic festivals worst christmas movies travel PlayStation award winner reviews DGA Comic Book video on demand WGN boxing Writers Guild of America Sneak Peek Set visit FOX strong female leads Box Office Avengers hollywood canceled TV shows MSNBC ITV The Walking Dead 20th Century Fox universal monsters a nightmare on elm street asian-american Awards Tour Discovery Channel women Fox News Logo Fantasy Watching Series E! YA toronto Baby Yoda Tubi 93rd Oscars Ghostbusters dramedy cancelled TV shows Tomatazos sequels Warner Bros. high school Oscars marvel cinematic universe Opinion diversity Rock japanese nfl Amazon Prime Video Spring TV kaiju The Witch war Countdown TV One Family zombies joker news tv talk aapi LGBT crime Lifetime Christmas movies Winners emmy awards live action revenge DC streaming service cancelled TV series 2019 Masterpiece dceu godzilla TBS mockumentary Academy Awards teaser Anna Paquin Hulu dogs Apple TV Red Carpet docudrama twilight police drama game show Valentine's Day Reality Competition Amazon Prime Animation blaxploitation pirates of the caribbean spy thriller talk show comedies TruTV Black History Month elevated horror Acorn TV movie historical drama vampires casting Television Academy video new star wars movies TCA Esquire Sci-Fi Crackle stoner serial killer 78th Annual Golden Globe Awards SXSW doctor who VICE Superheroes Cannes foreign 21st Century Fox YouTube adventure king kong golden globes Nickelodeon Schedule scary movies Photos Starz Certified Fresh based on movie heist movie comic thriller spanish language chucky Emmys Black Mirror Martial Arts new york Music crime drama james bond Heroines Columbia Pictures supernatural what to watch YouTube Red Disney Plus psychological thriller Trailer 4/20 Elton John GoT Cosplay See It Skip It ratings ESPN First Reviews Netflix Christmas movies TLC all-time Comedy obituary AMC Musical Ovation USA Network Comedy Central nbcuniversal sitcom Brie Larson Apple TV Plus critics renewed TV shows RT History VH1 PBS Biopics Nominations 2015 Funimation 2020 green book Adult Swim X-Men psycho Summer crime thriller MTV black politics latino robots rt archives Quiz Star Wars lord of the rings Character Guide Western mutant ABC Family President Star Trek Disney+ Disney Plus natural history french ViacomCBS Travel Channel Freeform Britbox BBC America Spike RT21 theme song indiana jones CNN OWN south america Holiday fresh superhero nature anime Women's History Month transformers Lucasfilm Nat Geo hidden camera Chernobyl classics versus blockbuster sequel Lifetime kong Peacock Marvel spanish discovery franchise cars Polls and Games Binge Guide streaming Hear Us Out dark Pacific Islander Podcast History Unbreakable Kimmy Schmidt Marathons documentaries cooking PaleyFest Rocketman spider-man Hallmark Christmas movies razzies die hard comics cartoon animated Pop TV Shudder FXX football canceled Mudbound Video Games Syfy true crime Apple TV+ witnail screen actors guild jamie lee curtis TIFF Pixar Sundance TV name the review sports Pride Month slashers Year in Review ABC Signature Drama 99% New York Comic Con YouTube Premium reboot American Society of Cinematographers spinoff DC Universe Fox Searchlight dc TCA 2017 Amazon OneApp italian golden globe awards Showtime DirecTV biography HBO docuseries Chilling Adventures of Sabrina Sundance Paramount Thanksgiving television concert best Walt Disney Pictures BET fast and furious Netflix 71st Emmy Awards remakes Winter TV CMT The Purge Pirates monster movies Extras movies venice TCA Awards scene in color deadpool National Geographic Mary Tyler Moore Pet Sematary 2017 HBO Max cops ID 2018 Disney streaming service Christmas sag awards scorecard political drama WarnerMedia Broadway Country 45 Election prank Captain marvel breaking bad dragons Grammys Marvel Television Shondaland miniseries Paramount Plus Sony Pictures blockbusters Sundance Now 24 frames romance Mindy Kaling FX on Hulu target Arrowverse BET Awards HBO Go Comics on TV quibi Lionsgate free movies Vudu Ellie Kemper Alien Stephen King Horror international USA VOD batman Superheroe Hallmark films technology screenings zero dark thirty ABC archives LGBTQ rotten satire halloween tv independent trailers Trophy Talk harry potter Epix rom-coms comic books saw Rocky cinemax The Walt Disney Company Song of Ice and Fire Infographic Marvel Studios halloween Mary poppins crossover A&E Cartoon Network BBC aliens Interview toy story Kids & Family CW Seed SDCC book Bravo Mystery Film Turner telelvision space Awards CBS TV Land romantic comedy Musicals Rom-Com";
// const tags = tagsString.split(" ");

// const run = async () => {
//   let actions = await knex("actions")
//     .select("id")
//     .where({ type: "comment" })
//     .andWhere({ parent_type: "comment" });
//   actions = actions.map((post) => post.id);

//   let users = await knex("users").select("id");
//   users = users.map((user) => user.id);
//   users = _.shuffle(users);

//   for (const item of actions) {
//     let results = [];
//     const childreactMax = getRandomInt(0, 5);

//     for (let i = 0; i < childreactMax; i++) {
//       results.push({
//         type: "interacts",
//         parent_type: "comment",
//         parent: item,
//         uid: _.shuffle(users)[0],
//         data: _.shuffle(interacts)[0],
//       });
//     }
//     if (childreactMax != 0) {
//       await knex("actions").insert(results);
//     }
//     console.log(`${actions.indexOf(item)} / ${actions.length}`);
//   }
//   console.log("DONE");
// };



run();
