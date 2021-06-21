const knex = require("../../../controllers/knex");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const fs = require("fs");
const minify = require("html-minifier").minify;
const baseUrl = [
  {
    name: "24 Frames",
    maxPage: 16,
    url: "https://editorial.rottentomatoes.com/24-frames/?wpv_view_count=1773-CATTR9e98b90c985a4770343603e5e63bd874TCPID54571&wpv_paged=",
  },
  {
    name: "All-Time Lists",
    maxPage: 2,
    url: "https://editorial.rottentomatoes.com/all-time-lists/?wpv_view_count=1773-CATTR9a61a7f98d435e1c32de073e05574776TCPID108310&wpv_paged=",
  },
  {
    name: "Binge Guide",
    maxPage: 15,
    url: "https://editorial.rottentomatoes.com/binge-guide/?wpv_view_count=1773-CATTR18dc47e185b72ded1a944850c4e86364TCPID7088&wpv_paged=",
  },
  {
    name: "Comics on TV",
    maxPage: 11,
    url: "https://editorial.rottentomatoes.com/comics-on-tv/?wpv_view_count=1773-CATTRfe92f9503fc6178e8d2a7a6405dd588aTCPID113600&wpv_paged=",
  },
  {
    name: "Countdown",
    maxPage: 21,
    url: "https://editorial.rottentomatoes.com/countdown/?wpv_view_count=1773-CATTRe0df1bb94bf9df998c3aa104813bf1cbTCPID63280&wpv_paged=",
  },
  {
    name: "Critics Consensus",
    maxPage: 51,
    url: "https://editorial.rottentomatoes.com/critics-consensus/?wpv_view_count=1773-CATTR62a75c677f8c3b6631bc68dc738b05aeTCPID5059&wpv_paged=",
  },
  {
    name: "Five Favorite Films",
    maxPage: 36,
    url: "https://editorial.rottentomatoes.com/five-favorite-films/?wpv_view_count=1773-CATTRf0fd401f31f4c9716b4842ae5b450611TCPID5063&wpv_paged=",
  },
  {
    name: "Now Streaming",
    maxPage: 19,
    url: "https://editorial.rottentomatoes.com/now-streaming/?wpv_view_count=1773-CATTRefa1e91cbb5bd57c9a2ac881bbf8082dTCPID5393&wpv_paged=",
  },
  {
    name: "Parental Guidance",
    maxPage: 20,
    url: "https://editorial.rottentomatoes.com/parental-guidance/?wpv_view_count=1773-CATTRa4cb495bf74ff88e1444e273ad88c570TCPID5514&wpv_paged=",
  },
  {
    name: "Red Carpet Roundup",
    maxPage: 7,
    url: "https://editorial.rottentomatoes.com/red-carpet-roundup/?wpv_view_count=1773-CATTR7610af02a133d491e526a92c8f377e42TCPID51288&wpv_paged=",
  },
  {
    name: "Scorecards",
    maxPage: 3,
    url: "https://editorial.rottentomatoes.com/movie-tv-scorecards/?wpv_view_count=1773-CATTRcbdf093aa9193b9e2c265db5a0e55e17TCPID108312&wpv_paged=",
  },
  {
    name: "Sub-Cult",
    maxPage: 3,
    url: "https://editorial.rottentomatoes.com/sub-cult/?wpv_view_count=1773-CATTRb1aa8cdf0b787a99ab9b1080837ab834TCPID59986&wpv_paged=",
  },
  {
    name: "Total Recall",
    maxPage: 33,
    url: "https://editorial.rottentomatoes.com/total-recall/?wpv_view_count=1773-CATTR9f607e2646b621ee3ba86a20c30e8315TCPID5639&wpv_paged=",
  },
  {
    name: "Video Interviews",
    maxPage: 48,
    url: "https://editorial.rottentomatoes.com/video-interviews/?wpv_view_count=1773-CATTR27d225ded07f547f3ba427b8865538bdTCPID7039&wpv_paged=",
  },
  {
    name: "Weekend Box Office",
    maxPage: 53,
    url: "https://editorial.rottentomatoes.com/weekend-box-office/?wpv_view_count=1773-CATTR56722600a39f928dc05348c314f451b1TCPID1771&wpv_paged=",
  },
  {
    name: "Weekly Ketchup",
    maxPage: 48,
    url: "https://editorial.rottentomatoes.com/weekly-ketchup/?wpv_view_count=1773-CATTRfee878bec2b8cf76c7cd142fefae1612TCPID7157&wpv_paged=",
  },
  {
    name: "What to Watch",
    maxPage: 2,
    url: "https://editorial.rottentomatoes.com/what-to-watch/?wpv_view_count=1773-CATTR2c7154a5960789eb2e9f97104329db09TCPID108316&wpv_paged=",
  },
  {
    name: "The Zeros",
    maxPage: 1,
    url: "https://editorial.rottentomatoes.com/the-zeros/",
  },
];
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
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
    console.log(">>>>>>>>>>>>>>>>");
    console.log(error);
    console.log(">>>>>>>>>>>>>>>>");
  }
};

const skeleton = {
  type: "news",
  title: "",
  uid: 47286125203462,
  content: "",
  data: {},
  slug: "",
  tags: [],
  interacts: [
    // {
    //   user: "",
    //   interact: "",
    // },
  ],
  crawl_data: {
    url: "",
    sections: [],
    preview_poster: "",
    date: "August 11, 2020", //LL
  },
};

const link = [
  "div[class='body_main container']",
  "div[class='header_main container']",
  "div[class='container  body_main container']",
  "div[class='col col-left-center col-full-xs']",
  "div[class='panel panel-rt panel-box article_body']",
  "div[class='panel-body'] > div",
  "div[class='row ']",
  "div[class='col-sm-8 newsItem col-full-xs']",
  "a[class='unstyled articleLink']",
];

const preview_poster = [
  "div[class='editorialColumnPic']",
  "img[class='attachment-full wp-post-image']",
];

const title = [
  "div[class='panel bannerCaption']",
  "div[class='panel-body']",
  "p[class='noSpacing title']",
];

const date = [
  "div[class='panel bannerCaption']",
  "div[class='panel-body']",
  "p[class='noSpacing publication-date']",
];

const contentPath = [
  "div[class='body_main container']",
  "div[class='header_main container']",
  "div[class='container body_main']",
  "div[id='article_main_body']",
  "div[class='panel-rt panel-box article_body']",
];

const crawl = async (url, name) => {
  try {
    const data = await fetchData(url);
    const $ = cheerio.load(data);
    const results = [];
    $("body")
      .find(link.join(" > "))
      .each((i, el) => {
        const result = deepClone(skeleton);
        result.title = $(el)
          .find(title.join(" > "))
          .html()
          .replace(/(<([^>]+)>)/gi, "")
          .trim();
        result.crawl_data.url = $(el).attr("href").trim();
        result.crawl_data.preview_poster =
          $(el).find(preview_poster.join(" > ")).attr("src") ||
          "https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/09/20131743/Ballistic-Ecks-Sever-Zeros.jpg";
        result.slug = result.crawl_data.url.split("/").reverse()[1];
        result.crawl_data.date = $(el).find(date.join(" > ")).text().trim();
        result.crawl_data.sections.push(name);
        results.push(result);
      });
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const run = async () => {
  let data = await knex("posts").select("id", "crawl_data");
  data = data.map((item) => {
    return { id: item.id, url: item.crawl_data.url };
  });
  for (const item of data) {
    try {
      const res = await fetchData(item.url);
      const $ = cheerio.load(res);
      let html = $("body").find(contentPath.join(" > ")).html();
      if (html && html.length) {
        html = minify(html, {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeEmptyElements: false,
          removeOptionalTags: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyJS: true,
          minifyCSS: true,
        });
        const [res] = await knex("posts")
          .update({ content: html })
          .where({ id: item.id })
          .returning("*");
        if (res) console.log(item.id);
      }
    } catch (err) {
      console.log("🚀 ------------------");
      console.log("🚀 ~ run ~ err", err);
      console.log("🚀 ------------------");
    }
  }
};

// const run = async () => {
//   for (const item of baseUrl) {
//     const pages = [];
//     for (let i = 1; i <= item.maxPage; i++) {
//       pages.push(i + "");
//     }
//     for (const page of pages) {
//       const data = await crawl(item.url + page, item.name);
//       for (const news of data) {
//         const [res] = await knex("posts").insert(news).returning("*");
//         if (res)
//           console.log({
//             name: item.name,
//             page,
//             url: news.crawl_data.url,
//           });
//       }
//     }
//   }
// };

run();
