const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
const cheerio = require("cheerio");
const controller = require("../../controllers/persons");
const moment = require("moment");
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const info = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "article[class='layout__column layout__column--main']",
  "section",
  "div[class=' celebrity-bio']",
  "div[class='celebrity-bio__content']",
];
const first_image = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "article[class='layout__column layout__column--main']",
  "section",
  "div[class=' celebrity-bio']",
  "a[class='celebrity-bio__hero-desktop'] > img",
];
const name = info.concat(["h1[class='celebrity-bio__h1']"]);
const birth = info.concat([
  "div[class='celebrity-bio__info']",
  "p[data-qa='celebrity-bio-bday']",
]);
const highestRated = info.concat([
  "div[class='celebrity-bio__info']",
  "p[data-qa='celebrity-bio-highest-rated']",
  "span[class='label']",
  "a[class='celebrity-bio__link']",
]);
const lowestRated = info.concat([
  "div[class='celebrity-bio__info']",
  "p[data-qa='celebrity-bio-lowest-rated']",
  "span[class='label']",
  "a[class='celebrity-bio__link']",
]);
const born_in = info.concat([
  "div[class='celebrity-bio__info']",
  "p[data-qa='celebrity-bio-birthplace']",
]);
const summary = info.concat([
  "div[class='celebrity-bio__info']",
  "p[data-qa='celebrity-bio-summary']",
]);
const best_rated1 = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "article[class='layout__column layout__column--main']",
  "section[id='dynamic-poster-list']",
  "tiles-carousel",
  "div[class='posters-container'] > a",
];
const best_rated2 = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "article[class='layout__column layout__column--main']",
  "section[id='dynamic-poster-list']",
  "tiles-carousel",
  "div[class='posters-container']",
  "tile-poster-video > a",
];
const join_flims = {
  url: [
    "div[class='container roma-layout__body']",
    "main[id='main_container']",
    "div[id='main-page-content']",
    "div[class='layout celebrity']",
    "article[class='layout__column layout__column--main']",
    "section[class='celebrity-filmography'] > div",
    "div[class='scroll-x'] > table > tbody > tr",
    "td[class='celebrity-filmography__title'] > a",
  ],
  role: [
    "div[class='container roma-layout__body']",
    "main[id='main_container']",
    "div[id='main-page-content']",
    "div[class='layout celebrity']",
    "article[class='layout__column layout__column--main']",
    "section[class='celebrity-filmography'] > div",
    "div[class='scroll-x'] > table > tbody > tr",
    "td[class='celebrity-filmography__credits']",
  ],
};
const base_relative_news = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "aside[class='layout__column layout__column--sidebar layout__column--sidebar-right mobile-hidden']",
  "section[class='celebrity-news']",
  "div > ol > li",
];
const relative_news = {
  url: base_relative_news.concat(["a"]),
  image: base_relative_news.concat(["a > div"]),
  title: base_relative_news.concat(["a > p"]),
};
const images = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "article[class='layout__column layout__column--main']",
  "section[class='celebrity-photos']",
  "div[class='celebrity-photos__wrap']",
  "div > ul > div > div > li > button",
];

const fetchData = async (url) => {
  try {
    let response;
    response = await axios({
      url,
      timeout: 8000,
      maxRedirects: 1000,
      validateStatus: function (status) {
        return status === 200; // default
      },
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
  name: "",
  birth: "",
  born_in: "",
  summary: "",
  images: [],
  slug: "",
  crawl_data: {
    url: "",
    best_rated: [],
    join_flims: [],
    relative_news: [],
    rated: {
      highest: "",
      lowest: "",
    },
  },
};

const getName = async ($) => {
  const result = $("body").find(name.join(" > ")).text().trim();
  return result;
};

const getBirth = async ($) => {
  const result =
    $("body")
      .find(birth.join(" > "))
      .text()
      .trim()
      .replace("Birthday:\n", "")
      .trim() || "";
  if (result.length) return moment(result).format().toString();
  return null;
};

const getBirthPlace = async ($) => {
  const result =
    $("body")
      .find(born_in.join(" > "))
      .text()
      .trim()
      .replace("Birthplace:\n", "")
      .trim() || "";
  return result;
};

const getSummary = async ($) => {
  const result = $("body").find(summary.join(" > ")).text().trim();
  return result;
};

const getFirstImage = async ($) => {
  const result =
    $("body").find(first_image.join(" > ")).attr("src").trim() || null;
  return result;
};

const getImages = async ($) => {
  const result =
    $("body").find(images.join(" > ")).attr("data-photo-id").trim() || null;
  return result;
};

const getPersons = async (url, $) => {
  try {
    const result = deepClone(skeleton);
    result.slug = url.replace("https://www.rottentomatoes.com/celebrity/", "");
    result.name = await getName($);
    result.birth = await getBirth($);
    result.born_in = await getBirthPlace($);
    result.summary = await getSummary($);
    result.images.push(await getFirstImage($));
    result.images.push(await getImages($));
    return result;
  } catch (error) {}
};

// processLineByLine();
const scrollBottom = () => {
  var count = arguments[arguments.length - 2] || 0x7fffffff;
  var callback = arguments[arguments.length - 1];

  /* get the scrollable container */
  var elm = document.elementFromPoint(
    window.innerWidth - 25,
    window.innerHeight / 2
  );
  for (; elm && (++elm.scrollTop, !elm.scrollTop); elm = elm.parentElement);
  elm = elm || document.documentElement;

  /* hook XMLHttpRequest to monitor Ajax requests */
  if (!("idle" in XMLHttpRequest))
    (function () {
      var n = 0,
        t = Date.now(),
        send = XMLHttpRequest.prototype.send;
      var dispose = function () {
        --n;
        t = Date.now();
      };
      var loadend = function () {
        setTimeout(dispose, 1);
      };
      XMLHttpRequest.idle = function () {
        return n > 0 ? 0 : Date.now() - t;
      };
      XMLHttpRequest.prototype.send = function () {
        ++n;
        this.addEventListener("loadend", loadend);
        send.apply(this, arguments);
      };
    })();

  /* scroll until steady scrollHeight or count of scroll and no pending request */
  var i = 0,
    scrollHeight = -1,
    scrollTop = -1;
  (function scroll() {
    if (
      (scrollHeight === elm.scrollHeight || i === count) &&
      XMLHttpRequest.idle() > 60
    )
      return callback(i);
    scrollTop = elm.scrollTop;
    scrollHeight = elm.scrollHeight;
    if (i < count)
      i += ((elm.scrollTop = 0x7fffffff), scrollTop !== elm.scrollTop);
    setTimeout(scroll, 100);
  })();
};

// const processLineByLine = async () => {
//   const file = fs.createReadStream("persons.txt");

//   const readLine = readline.createInterface({
//     input: file,
//     crlfDelay: Infinity,
//   });

//   for await (const line of readLine) {
//   }
// };

// processLineByLine();

const { Builder, until } = require("selenium-webdriver");
let driver = new Builder()
  .forBrowser("firefox")
  .usingServer("http://localhost:4444/wd/hub")
  .build();
driver
  .get("https://www.rottentomatoes.com/celebrity/anne_baxter")
  .then(() =>
    driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
  )
  .then(() => driver.getPageSource())
  .then(async (source) => {
    const $ = cheerio.load(source);
    await getPersons("https://www.rottentomatoes.com/celebrity/anne_baxter", $);
  })
  .then(() => {
    driver.quit();
  });
