const fs = require("fs");
const axios = require("axios").default;
const cheerio = require("cheerio");
const movieUrl = "https://www.rottentomatoes.com/m/american_in_paris";

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const links = [
  "div[class='body_main container']",
  "div[id='main_container']",
  "div[class='col-left-center col-full-xs']",
  "section[id='top_movies_main']",
  "div[class='panel-body content_body allow-overflow']",
  "table[class='table']",
  "tbody > tr > td > a[class='unstyled articleLink']",
];

const crawlLinkMovie = async (url) => {
  try {
    const data = await fetchData(url);
    const $ = cheerio.load(data);
    const results = [];
    $("body")
      .find(links.join(" > "))
      .each((i, el) => {
        results.push(
          "https://www.rottentomatoes.com" + $(el).attr("href").trim()
        );
      });
    return results;
  } catch (err) {
    return false;
  }
};

const getAllLink = async () => {
  let url = "https://www.rottentomatoes.com/top/bestofrt/?year=";
  let results = [];
  for (let i = 1950; i <= 2021; i++) {
    const tempResult = await crawlLinkMovie(url + i);
    console.log("🚀 ---------------------------------------");
    console.log("🚀 ~ getAllLink ~ tempResult", tempResult);
    console.log("🚀 ---------------------------------------");
    results = results.concat(tempResult);
    console.log(i);
  }
  fs.writeFile("links.json", JSON.stringify({ data: results }), "utf8", () => {
    console.log("done");
  });
};

const fetchData = async (url) => {
  try {
    let response;
    response = await axios({
      url,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    // console.log("Axios error");
  }
};

const skeleton = {
  id: "",
  type: "movie",
  info: {
    name: "",
    trailerImage: "../../public/images/best-movies-1614634680.jpg",
    trailer: "https://www.youtube.com/embed/a-qiMS8fnV4",
    rating: "PG-13",
    summary:
      "In 1970, paranormal investigators and demonologists Lorraine (Vera Farmiga) and Ed (Patrick Wilson) Warren are summoned to the home of Carolyn (Lili Taylor) and Roger (Ron Livingston) Perron. The Perrons and their five daughters have recently moved into a secluded farmhouse, where a supernatural presence has made itself known. Though the manifestations are relatively benign at first, events soon escalate in horrifying fashion, especially after the Warrens discover the house's macabre history.",
    genres: [],
    originalLanguage: "English",
    theatersDate: "Jul 19, 2013",
    streamingDate: "Jul 19, 2013",
    boxOffice: "$137.4M",
    productions: [],
    soundMixs: [],
    aspectRatio: "Scope (2.35:1)",
    collection: "",
    runtime: "1h 51m",
    poster: "http://localhost:3842/static/img/sample-poster.06fa1ae.png",
  },
  whatToKnows: [
    // {
    //   title: "String",
    //   content: "String",
    // },
  ],
  streamings: [],
  photos: [],
  crews: [
    // {
    //   personName: "",
    //   personId: "",
    //   castName: "giam doc san xuat || Tony Stark || bien kich",
    // },
  ],
  quotes: [
    // {
    //   name: "",
    //   content: "",
    // },
  ],
  postIds: [],
};
const base = [
  "div[class='body_main container']",
  "div[id='main_container']",
  "section[class='mob-body ']",
  "div[id='mainColumn']",
];
const info = {
  name: [
    "div[id='topSection']",
    "score-board[class='scoreboard']",
    "div[class='info-container']",
    "h1[class='scoreboard__title']",
  ],
  //data-thumbnail
  trailerImage: ["hero-image", "button[class='trailer_play_action_button']"],
  rating: [
    "div[id='topSection']",
    "score-board[class='scoreboard']",
    "div[class='info-container']",
    "span[id='rating']",
  ],
  //trim
  summary: [
    "section[class='panel panel-rt panel-box movie_info media']",
    "div[class='media-body']",
    "div[class='panel-body content_body']",
    "div[id='movieSynopsis']",
  ],
  detail: [
    "section[class='panel panel-rt panel-box movie_info media']",
    "div[class='media-body']",
    "div[class='panel-body content_body']",
    "ul[class='content-meta info'] > li > div",
  ],
  poster: [
    "div[id='topSection']",
    "div[class='movie-thumbnail-wrap']",
    "div[class='center'] > img",
  ],
};
const whatToKnows = [
  "div[id='topSection']",
  "section[id='where-to-know']",
  "div[class='what-to-know__body']",
  "section > p > span",
];
const streamings = [
  "div[id='topSection']",
  "section[id='where-to-watch']",
  //data-affiliate
  "div[class='where-to-watch__body'] > ul > li > a",
];
const photos = [
  "section[class='panel panel-rt panel-box']",
  "div[class='panel-body content_body allow-overflow']",
  "div[id='photos-carousel-root']",
  "div[class='Carousel PhotosCarousel slick-initialized slick-slider slick-dotted']",
  "div[class='slick-list draggable']",
  "div[class='slick-track'] > div > div > a > img",
];
const crews = [
  "section[id='movie-cast']",
  "div[class='panel-body content_body']",
  "div[class='castSection ']",
  "div[data-qa='cast-crew-item']",
  "div[class='media-body'] > a",
];

const crawlLinkPerson = async (url) => {
  try {
    const data = await fetchData(url);
    const $ = cheerio.load(data);
    const results = [];
    $("body")
      .find(base.concat(crews).join(" > "))
      .each((i, el) => {
        results.push(
          "https://www.rottentomatoes.com" + $(el).attr("href").trim()
        );
      });
    return results;
  } catch (err) {
    return [];
  }
};
const getPersons = async () => {
  let movieUrl = await fs.readFileSync("links.json");
  let movies = JSON.parse(movieUrl).data;
  for (const movieUrl of movies) {
    const tempResults = await crawlLinkPerson(movieUrl);
    for (const person of tempResults) {
      await fs.appendFileSync("persons.json", person + "\n", "utf8");
    }
  }
};

getPersons();
