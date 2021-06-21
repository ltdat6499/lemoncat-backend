const fs = require("fs");
const readline = require("readline");
const cheerio = require("cheerio");
const controller = require("../../../controllers/persons");
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
const relative_news = [
  "div[class='container roma-layout__body']",
  "main[id='main_container']",
  "div[id='main-page-content']",
  "div[class='layout celebrity']",
  "aside[class='layout__column layout__column--sidebar layout__column--sidebar-right mobile-hidden']",
  "section[class='celebrity-news']",
  "div > ol[class='celebrity-news-list']",
  "li[class='celebrity-news-list__item'] > a",
];
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
  try {
    if (result.length && result !== "Not Available")
      return moment(result).format().toString();
    return "1978-12-27";
  } catch (error) {
    return "1978-12-27";
  }
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
  const result = $("body").find(summary.join(" > ")).text().trim() || "";
  return result;
};

const getFirstImage = async ($) => {
  const result =
    $("body").find(first_image.join(" > ")).attr("src").trim() || "";
  return result;
};

const getImages = async ($) => {
  const results = [];
  $("body")
    .find(images.join(" > "))
    .each((i, el) => {
      results.push($(el).attr("data-photo-id").trim());
    });
  return results;
};

const getBestRated = async ($) => {
  const results = [];

  $("body")
    .find(best_rated1.join(" > "))
    .each((i, el) => {
      results.push(
        "https://www.rottentomatoes.com" + $(el).attr("href").trim()
      );
    });
  $("body")
    .find(best_rated2.join(" > "))
    .each((i, el) => {
      results.push(
        "https://www.rottentomatoes.com" + $(el).attr("href").trim()
      );
    });
  return results;
};

const getHighestRated = async ($) => {
  const result =
    "https://www.rottentomatoes.com" +
    $("body").find(highestRated.join(" > ")).attr("href").trim();
  return result;
};

const getLowestRated = async ($) => {
  const result =
    "https://www.rottentomatoes.com" +
    $("body").find(lowestRated.join(" > ")).attr("href").trim();
  return result;
};

const getRelativeNews = async ($) => {
  const results = [];
  $("body")
    .find(relative_news.join(" > "))
    .each((i, el) => {
      const url = $(el).attr("href").trim();
      const title = $(el)
        .html()
        .replace(/(<([^>]+)>)/gi, "")
        .trim();
      results.push({
        url,
        title,
      });
    });
  return results;
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
    result.images = result.images.concat(await getImages($));
    result.crawl_data.url = url;
    result.crawl_data.best_rated = result.crawl_data.best_rated.concat(
      await getBestRated($)
    );

    result.crawl_data.relative_news = result.crawl_data.relative_news.concat(
      await getRelativeNews($)
    );
    result.crawl_data.rated.highest = await getHighestRated($);
    result.crawl_data.rated.lowest = await getLowestRated($);
    return result;
  } catch (error) {
    console.log("ERRORRRRR");
    console.log(error);
    console.log("ERRORRRRR");
  }
};

const loadArray = async () => {
  const file = fs.createReadStream("persons-uniq.txt");

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

const { Builder, until } = require("selenium-webdriver");
const fetchData = async (url) => {
  let driver = new Builder()
    .forBrowser("firefox")
    .usingServer("http://localhost:4444/wd/hub")
    .build();
  await driver.get(url);
  await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
  const result = await driver.getPageSource();
  await driver.quit();
  return cheerio.load(result);
};

const crawler = async () => {
  const links = await loadArray();

  for (const link of links) {
    const $ = await fetchData(link);
    const data = await getPersons(link, $);
    if (data) {
      const [result] = await controller.create(data);
      console.log(result.id);
    } else {
      await fs.appendFileSync("errors.txt", link + "\n", "utf8");
      console.log("Error: " + link);
    }
  }
};

crawler();
