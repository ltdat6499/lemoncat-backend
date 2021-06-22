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
const readline = require("readline");

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

const loadArray = async () => {
  const file = fs.createReadStream("miss-link.txt");
  const lines = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of lines) {
    results.push(line);
  }
  return results;
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

// const crawl = async (url, name) => {
//   try {
//     const data = await fetchData(url);
//     const $ = cheerio.load(data);
//     const results = [];
//     $("body")
//       .find(link.join(" > "))
//       .each((i, el) => {
//         const result = deepClone(skeleton);
//         result.title = $(el)
//           .find(title.join(" > "))
//           .html()
//           .replace(/(<([^>]+)>)/gi, "")
//           .trim();
//         result.crawl_data.url = $(el).attr("href").trim();
//         result.crawl_data.preview_poster =
//           $(el).find(preview_poster.join(" > ")).attr("src") ||
//           "https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/09/20131743/Ballistic-Ecks-Sever-Zeros.jpg";
//         result.slug = result.crawl_data.url.split("/").reverse()[1];
//         result.crawl_data.date = $(el).find(date.join(" > ")).text().trim();
//         result.crawl_data.sections.push(name);
//         results.push(result);
//       });
//     return results;
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
// };

// const run = async () => {
//   let data = await knex("posts").select("id", "content", "crawl_data");
//   data = data
//     .filter((item) => item.content === null || item.content.length === 0)
//     .map((item) => {
//       return { id: item.id, url: item.crawl_data.url };
//     });

//   for (const item of data) {
//     try {
//       const res = await fetchData(item.url);
//       const $ = cheerio.load(res);
//       let html = $("body").find(contentPath.join(" > ")).html().trim();
//       // let html = `<h2 class=panel-heading><a style=text-decoration:none;color:#1c1c1c href=https://editorial.rottentomatoes.com/critics-consensus/ >Critics Consensus</a></h2><div class=sponsorship_ad><div id=article_sponsorship_ad class=page_ad style=height:0></div><script>var mps=mps||{};mps._queue=mps._queue||{},mps._queue.gptloaded=mps._queue.gptloaded||[],mps._queue.gptloaded.push(function(){mps.rt.insertlogo("#article_sponsorship_ad","ploc=articlesponsorship")})</script></div><div class=panel-body><h1><em>Incredibles 2</em> Is Certified Fresh</h1><h2 class=subtext>Plus, <em>Tag</em> is mildly entertaining and <em>Superfly</em> is more style than substance.</h2><div class="small subtle">by <a href=https://editorial.rottentomatoes.com/author/jeff-giles/ title="Posts by Jeff Giles" class="author url fn" rel=author>Jeff Giles</a> | June 14, 2018 | <span class="glyphicon glyphicon-comment commenticon"></span> <a href=#disqus_thread><span class=disqus-comment-count data-disqus-url=https://editorial.rottentomatoes.com/article/incredibles-2-is-certified-fresh/ >Comments</span></a></div><hr><div style=padding-bottom:20px><div id=social-tools-widget><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_fb_like.png class="social-tools-facebook-like fb_like"></a><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_fb_share.png class=social-tools-facebook-share></a><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_twitter.png class=social-tools-twitter></a><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_google.png class=social-tools-googleplus></a></div></div><div class=articleContentBody><p>This weekend at the movies,&nbsp;we have a belated sequel to a Pixar classic (<a href=https://www.rottentomatoes.com/m/incredibles_2><em>Incredibles 2</em></a>, featuring the voices of&nbsp;<a href=https://www.rottentomatoes.com/celebrity/holly_hunter>Holly Hunter</a>&nbsp;and&nbsp;<a href=https://www.rottentomatoes.com/celebrity/craig_t_nelson>Craig T. Nelson</a>), some of Hollywood’s funniest fellows trying to touch one another without permission (<a href=https://www.rottentomatoes.com/m/tag_2018><em>Tag</em></a>, starring&nbsp;<a href=https://www.rottentomatoes.com/celebrity/ed_helms>Ed Helms</a>,&nbsp;<a href=https://www.rottentomatoes.com/celebrity/jeremy_renner>Jeremy Renner</a>, and <a href=https://www.rottentomatoes.com/celebrity/jon_hamm>Jon Hamm</a>), and a remade blast from the blaxploitation past (<a href=https://www.rottentomatoes.com/m/superfly_2018><em>Superfly</em></a>, starring <a href=https://www.rottentomatoes.com/celebrity/trevor_jackson>Trevor Jackson</a>&nbsp;and <a href=https://www.rottentomatoes.com/celebrity/jason_mitchell>Jason Mitchell</a>).&nbsp;What are the critics saying?<hr><div class=clearfix><div class="col-sm-17 article_movie_title"><h2><a href=https://www.rottentomatoes.com/m/incredibles_2/ >Incredibles 2</a> <span class=subtle>(2018)</span> <span title="Certified Fresh" class="icon tiny certified"></span> <span class=tMeterScore>93%</span></h2></div><a class="col-sm-7 col-xs-24 article_movie_poster" href=https://www.rottentomatoes.com/m/incredibles_2/ ><div><img class=article_poster src="https://resizing.flixster.com/ZFyKYTInxDin6Z31XZNY44Jaulc=/180x267/v1.bTsxMjcxMzEzMTtqOzE4ODY4OzIwNDg7MTA4NjsxNjA5" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-17><div><p><p>If you’re going to try and follow up an acclaimed blockbuster, you might as well take your time getting the sequel right — and in animation, where time can stand still forever, you have the added benefit of not needing to rush your cast back in front of the camera. Still, after waiting nearly 15 years for a second installment of <a href=https://www.rottentomatoes.com/m/incredibles><em>The Incredibles</em></a>, fans can be forgiven a certain amount of impatience; while the creative teams at formerly franchise-averse Pixar dreamed up new stories for the characters in <a href=https://www.rottentomatoes.com/m/toy_story><em>Toy Story</em></a>, <a href=https://www.rottentomatoes.com/m/cars><em>Cars</em></a>, <a href=https://www.rottentomatoes.com/m/finding_nemo><em>Finding Nemo</em></a>, and <a href=https://www.rottentomatoes.com/m/monsters_inc><em>Monsters Inc.</em></a>, the ability to return to theaters continued to elude the superpowered Parr family. All that waiting has finally paid off with <a href=https://www.rottentomatoes.com/m/incredibles_2><em>Incredibles 2</em></a>, which reunites the original voice cast for a new adventure serving up more of the domestic turmoil, superhero satire, and brilliantly animated action that made the first one such a hit. It’d be tough to improve on the original <em>Incredibles</em>, and critics say that while this sequel doesn’t quite pull off that feat, it comes impressively close, adding yet another acclaimed entry to Pixar’s already estimable filmography. If you were a kid when <em>The Incredibles</em>&nbsp;came out, you might have kids of your own now — and like all the best stuff the studio has put out, the whole family can look forward to enjoying <em>Incredibles 2</em>.<p></div></div></div><hr><div class=clearfix><div class="col-sm-17 article_movie_title"><h2><a href=https://www.rottentomatoes.com/m/tag_2018/ >Tag</a> <span class=subtle>(2018)</span> <span title=Rotten class="icon tiny rotten"></span> <span class=tMeterScore>56%</span></h2></div><a class="col-sm-7 col-xs-24 article_movie_poster" href=https://www.rottentomatoes.com/m/tag_2018/ ><div><img class=article_poster src="https://resizing.flixster.com/XU1jlKV_BNphbye7u24RPrTM7Ig=/180x267/v1.bTsxMjc2MDUyMjtqOzE4ODc0OzIwNDg7NDA1MDs2MDAw" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-17><div><p><p>On one hand, it’s easy to believe Hollywood has long since exhausted most of the reasonable possibilities for comedy that exist in movies about grown men acting like boys. On the other, when you’ve got the Wall Street Journal writing about a real-life group of guys who take a month off every year to continue the game of tag they’ve been playing since they were kids, well, it’s awfully hard to resist the temptation to turn that into a film. Enter the descriptively titled <a href=https://www.rottentomatoes.com/m/tag_2018><em>Tag</em></a>, starring <a href=https://www.rottentomatoes.com/celebrity/hannibal_buress>Hannibal Buress</a>, Jon Hamm, Ed Helms, <a href=https://www.rottentomatoes.com/celebrity/jake_johnson_2>Jake Johnson</a>, and Jeremy Renner as the fellows in question — a talented bunch whose commitment to the story was reflected in the set injury Renner sustained, breaking both of his arms and necessitating some last-minute CGI limb replacements in post-production. It would be wonderful to report that Renner’s suffering came in service of one of the year’s best-reviewed action comedies; alas, the truth is that critics are kinda meh on <em>Tag</em>, which reviews describe as funny and engaging in fits and starts, but ultimately not consistent or committed enough to fully deliver on its premise. Still, this is one talented cast, and even the critical pans say the movie isn’t without its moments, so if you’re in the mood for some arrested development laughs, you may want to check your local listings.<p></div></div></div><hr><div class=clearfix><div class="col-sm-17 article_movie_title"><h2><a href=https://www.rottentomatoes.com/m/superfly_2018/ >Superfly</a> <span class=subtle>(2018)</span> <span title=Rotten class="icon tiny rotten"></span> <span class=tMeterScore>51%</span></h2></div><a class="col-sm-7 col-xs-24 article_movie_poster" href=https://www.rottentomatoes.com/m/superfly_2018/ ><div><img class=article_poster src="https://resizing.flixster.com/ehj_8SBQXKPMqz8IrImI6itywlI=/180x267/v1.bTsxMjY5NjQ5NTtqOzE4ODgxOzIwNDg7MjAyNTszMDAw" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-17><div><p><p>Released in 1972, the original <em><a href=https://www.rottentomatoes.com/m/superfly>Superfly</a></em>&nbsp;helped lead the blaxploitation wave with a thoughtful Harlem-set drama about a drug dealer looking for one last big score; the movie’s trappings may look somewhat dated today, but thanks to <a href=https://www.rottentomatoes.com/celebrity/ron_oneal>Ron O’Neal</a>‘s performance as main character Youngblood Priest — not to mention a killer Curtis Mayfield soundtrack — it still feels fresh. It’s easy to understand why music video veteran <a href=https://www.rottentomatoes.com/celebrity/director_x>Director X</a> wanted to take a shot at updating the story, and its themes are just as relevant as they were more than 45 years ago; unfortunately, critics say those themes have mostly been lost in this new version, which is far more focused on style than substance. Starring Trevor Jackson as Priest, the 2018 edition moves the action to Atlanta, but the basic contours of the story remain the same — which is part of why a number of reviews have outlined pundits’ disappointment with the lost social subtext. This <a href=https://www.rottentomatoes.com/m/superfly_2018><em>Superfly</em></a>&nbsp;will make its fortune by and by, thanks to Director X’s way with an artfully arranged scene or set piece, but as is so often the case with remakes, the original still reigns supreme.<p></div></div></div><hr><h2><strong>What’s New on TV</strong></h2><div class=clearfix><div class="col-sm-20 article_tv_title"><h2><a href=//www.rottentomatoes.com/tv/the_bold_type/s02/ >The Bold Type: Season 2</a> <span class=subtle>(2018)</span> <span title="Certified Fresh" class="icon tiny certified"></span> <span class=tMeterScore>100%</span></h2></div><a class="col-sm-4 col-xs-24 article_tv_poster" href=//www.rottentomatoes.com/tv/the_bold_type/s02/ ><div><img class=article_poster src="https://resizing.flixster.com/xHMOoViBMja8NBKe9mRdzYiMPV4=/120x180/v1.dDszMDkxNzc7ajsxODg0MDsyMDQ4OzE3MDA7MjU1MA" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-20><div><p><p><a href=https://www.rottentomatoes.com/tv/the_bold_type/s02><em>The Bold Type</em></a> presents an aspirational yet refreshingly realistic portrait of young women’s careers, friendships and love lives in a big city.<p></div></div></div><hr><div class=clearfix><div class="col-sm-20 article_tv_title"><h2><a href=//www.rottentomatoes.com/tv/strange_angel/s01/ >Strange Angel: Season 1</a> <span class=subtle>(2018)</span> <span title=Fresh class="icon tiny fresh"></span> <span class=tMeterScore>71%</span></h2></div><a class="col-sm-4 col-xs-24 article_tv_poster" href=//www.rottentomatoes.com/tv/strange_angel/s01/ ><div><img class=article_poster src="https://resizing.flixster.com/95WlEL_q0lHyYaKmQzWnQDEkX84=/120x179/v1.dDszMDA3NDg7ajsxODgyNjsyMDQ4OzEwMDA7MTQ5Mw" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-20><div><p><p>A beautiful slow burn, <a href=https://www.rottentomatoes.com/tv/strange_angel/s01><em>Strange Angel</em></a> shoots for the stars, but gets a little lost in its own orbit.<p></div></div></div><hr><p><strong>Also&nbsp;Opening This Week In Limited Release</strong><ul><li><span title="Certified Fresh" class="icon tiny certified"></span> <a href=https://www.rottentomatoes.com/m/eating_animals/ >Eating Animals </a><span class=subtle>(2018)</span> , a documentary about the commercial factory farming industry and its various impacts, is at 100%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/a_skin_so_soft/ >A Skin So Soft (Ta peau si lisse) </a><span class=subtle>(2018)</span> , a documentary look at the lives and gym habits of six bodybuilders, is at 100%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/the_year_of_spectacular_men/ >The Year of Spectacular Men </a><span class=subtle>(2018)</span> , a coming of age drama directed by <a href=https://www.rottentomatoes.com/celebrity/lea_thompson>Lea Thompson</a> and starring her daughters <a href=https://www.rottentomatoes.com/celebrity/zoey_deutch>Zoey</a> and <a href=https://www.rottentomatoes.com/celebrity/madelyn_deutch>Madelyn Deutch</a> (the latter of whom wrote the screenplay), is at 80%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/gabriel_and_the_mountain/ >Gabriel and the Mountain (Gabriel e a montanha) </a><span class=subtle>(2018)</span> , about a young man who sets out to travel the world before beginning college, is at 75%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/five_seasons_the_gardens_of_piet_oudolf/ >Five Seasons: The Gardens Of Piet Oudolf </a><span class=subtle>(2018)</span> , a documentary about the aesthetics and public works of the titular plantsman, is at 71%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/the_yellow_birds/ >The Yellow Birds </a><span class=subtle>(2018)</span> , an Iraq War drama led by <a href=https://www.rottentomatoes.com/celebrity/alden-ehrenreich>Alden Ehrenreich</a> and <a href=https://www.rottentomatoes.com/celebrity/tye_sheridan>Tye Sheridan</a>, is at 44%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/loving_pablo/ >Loving Pablo </a><span class=subtle>(2018)</span> , starring <a href=https://www.rottentomatoes.com/celebrity/javier_bardem>Javier Bardem</a> and <a href=https://www.rottentomatoes.com/celebrity/penelope_cruz_2>Penélope Cruz</a> in a biopic about the love between drug kingpin Pablo Escobar and journalist Virginia Vallejo, is at 35%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/gotti_2018/ >Gotti </a><span class=subtle>(2018)</span> , starring <a href=https://www.rottentomatoes.com/celebrity/john_travolta>John Travolta</a> as infamous mob boss John Gotti, is at 0%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/china_salesman/ >China Salesman </a><span class=subtle>(2018)</span> , an action adventure about a Chinese salesman who somehow becomes embroiled in an adventure that involves <a href=https://www.rottentomatoes.com/celebrity/steven_seagal>Steven Seagal</a> and <a href=https://www.rottentomatoes.com/celebrity/mike_tyson>Mike Tyson</a> punching one another, is at 0%.</ul></div></div>`;
//       if (html && html.length) {
//         html = html.toString();
//         html = minify(html, {
//           removeComments: true,
//           removeCommentsFromCDATA: true,
//           removeCDATASectionsFromCDATA: true,
//           collapseWhitespace: true,
//           collapseBooleanAttributes: true,
//           removeAttributeQuotes: true,
//           removeRedundantAttributes: true,
//           useShortDoctype: true,
//           removeEmptyAttributes: true,
//           removeEmptyElements: false,
//           removeOptionalTags: true,
//           removeScriptTypeAttributes: true,
//           removeStyleLinkTypeAttributes: true,
//           minifyJS: true,
//           minifyCSS: true,
//         });
//         const [result] = await knex("posts")
//           .update({ content: html })
//           .where({ id: item.id })
//           .returning("*");
//         if (result) console.log(item.id);
//       }
//     } catch (err) {
//       console.log("🚀 ~ run ~ err", err);
//     }
//   }
// };

let constHtml = `<h2 class=panel-heading><a style=text-decoration:none;color:#1c1c1c href=https://editorial.rottentomatoes.com/critics-consensus/ >Critics Consensus</a></h2><div class=sponsorship_ad><div id=article_sponsorship_ad class=page_ad style=height:0></div><script>var mps=mps||{};mps._queue=mps._queue||{},mps._queue.gptloaded=mps._queue.gptloaded||[],mps._queue.gptloaded.push(function(){mps.rt.insertlogo("#article_sponsorship_ad","ploc=articlesponsorship")})</script></div><div class=panel-body><h1><em>Incredibles 2</em> Is Certified Fresh</h1><h2 class=subtext>Plus, <em>Tag</em> is mildly entertaining and <em>Superfly</em> is more style than substance.</h2><div class="small subtle">by <a href=https://editorial.rottentomatoes.com/author/jeff-giles/ title="Posts by Jeff Giles" class="author url fn" rel=author>Jeff Giles</a> | June 14, 2018 | <span class="glyphicon glyphicon-comment commenticon"></span> <a href=#disqus_thread><span class=disqus-comment-count data-disqus-url=https://editorial.rottentomatoes.com/article/incredibles-2-is-certified-fresh/ >Comments</span></a></div><hr><div style=padding-bottom:20px><div id=social-tools-widget><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_fb_like.png class="social-tools-facebook-like fb_like"></a><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_fb_share.png class=social-tools-facebook-share></a><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_twitter.png class=social-tools-twitter></a><a href=#><img src=https://static.rottentomatoes.com/static/images/social/social_google.png class=social-tools-googleplus></a></div></div><div class=articleContentBody><p>This weekend at the movies,&nbsp;we have a belated sequel to a Pixar classic (<a href=https://www.rottentomatoes.com/m/incredibles_2><em>Incredibles 2</em></a>, featuring the voices of&nbsp;<a href=https://www.rottentomatoes.com/celebrity/holly_hunter>Holly Hunter</a>&nbsp;and&nbsp;<a href=https://www.rottentomatoes.com/celebrity/craig_t_nelson>Craig T. Nelson</a>), some of Hollywood’s funniest fellows trying to touch one another without permission (<a href=https://www.rottentomatoes.com/m/tag_2018><em>Tag</em></a>, starring&nbsp;<a href=https://www.rottentomatoes.com/celebrity/ed_helms>Ed Helms</a>,&nbsp;<a href=https://www.rottentomatoes.com/celebrity/jeremy_renner>Jeremy Renner</a>, and <a href=https://www.rottentomatoes.com/celebrity/jon_hamm>Jon Hamm</a>), and a remade blast from the blaxploitation past (<a href=https://www.rottentomatoes.com/m/superfly_2018><em>Superfly</em></a>, starring <a href=https://www.rottentomatoes.com/celebrity/trevor_jackson>Trevor Jackson</a>&nbsp;and <a href=https://www.rottentomatoes.com/celebrity/jason_mitchell>Jason Mitchell</a>).&nbsp;What are the critics saying?<hr><div class=clearfix><div class="col-sm-17 article_movie_title"><h2><a href=https://www.rottentomatoes.com/m/incredibles_2/ >Incredibles 2</a> <span class=subtle>(2018)</span> <span title="Certified Fresh" class="icon tiny certified"></span> <span class=tMeterScore>93%</span></h2></div><a class="col-sm-7 col-xs-24 article_movie_poster" href=https://www.rottentomatoes.com/m/incredibles_2/ ><div><img class=article_poster src="https://resizing.flixster.com/ZFyKYTInxDin6Z31XZNY44Jaulc=/180x267/v1.bTsxMjcxMzEzMTtqOzE4ODY4OzIwNDg7MTA4NjsxNjA5" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-17><div><p><p>If you’re going to try and follow up an acclaimed blockbuster, you might as well take your time getting the sequel right — and in animation, where time can stand still forever, you have the added benefit of not needing to rush your cast back in front of the camera. Still, after waiting nearly 15 years for a second installment of <a href=https://www.rottentomatoes.com/m/incredibles><em>The Incredibles</em></a>, fans can be forgiven a certain amount of impatience; while the creative teams at formerly franchise-averse Pixar dreamed up new stories for the characters in <a href=https://www.rottentomatoes.com/m/toy_story><em>Toy Story</em></a>, <a href=https://www.rottentomatoes.com/m/cars><em>Cars</em></a>, <a href=https://www.rottentomatoes.com/m/finding_nemo><em>Finding Nemo</em></a>, and <a href=https://www.rottentomatoes.com/m/monsters_inc><em>Monsters Inc.</em></a>, the ability to return to theaters continued to elude the superpowered Parr family. All that waiting has finally paid off with <a href=https://www.rottentomatoes.com/m/incredibles_2><em>Incredibles 2</em></a>, which reunites the original voice cast for a new adventure serving up more of the domestic turmoil, superhero satire, and brilliantly animated action that made the first one such a hit. It’d be tough to improve on the original <em>Incredibles</em>, and critics say that while this sequel doesn’t quite pull off that feat, it comes impressively close, adding yet another acclaimed entry to Pixar’s already estimable filmography. If you were a kid when <em>The Incredibles</em>&nbsp;came out, you might have kids of your own now — and like all the best stuff the studio has put out, the whole family can look forward to enjoying <em>Incredibles 2</em>.<p></div></div></div><hr><div class=clearfix><div class="col-sm-17 article_movie_title"><h2><a href=https://www.rottentomatoes.com/m/tag_2018/ >Tag</a> <span class=subtle>(2018)</span> <span title=Rotten class="icon tiny rotten"></span> <span class=tMeterScore>56%</span></h2></div><a class="col-sm-7 col-xs-24 article_movie_poster" href=https://www.rottentomatoes.com/m/tag_2018/ ><div><img class=article_poster src="https://resizing.flixster.com/XU1jlKV_BNphbye7u24RPrTM7Ig=/180x267/v1.bTsxMjc2MDUyMjtqOzE4ODc0OzIwNDg7NDA1MDs2MDAw" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-17><div><p><p>On one hand, it’s easy to believe Hollywood has long since exhausted most of the reasonable possibilities for comedy that exist in movies about grown men acting like boys. On the other, when you’ve got the Wall Street Journal writing about a real-life group of guys who take a month off every year to continue the game of tag they’ve been playing since they were kids, well, it’s awfully hard to resist the temptation to turn that into a film. Enter the descriptively titled <a href=https://www.rottentomatoes.com/m/tag_2018><em>Tag</em></a>, starring <a href=https://www.rottentomatoes.com/celebrity/hannibal_buress>Hannibal Buress</a>, Jon Hamm, Ed Helms, <a href=https://www.rottentomatoes.com/celebrity/jake_johnson_2>Jake Johnson</a>, and Jeremy Renner as the fellows in question — a talented bunch whose commitment to the story was reflected in the set injury Renner sustained, breaking both of his arms and necessitating some last-minute CGI limb replacements in post-production. It would be wonderful to report that Renner’s suffering came in service of one of the year’s best-reviewed action comedies; alas, the truth is that critics are kinda meh on <em>Tag</em>, which reviews describe as funny and engaging in fits and starts, but ultimately not consistent or committed enough to fully deliver on its premise. Still, this is one talented cast, and even the critical pans say the movie isn’t without its moments, so if you’re in the mood for some arrested development laughs, you may want to check your local listings.<p></div></div></div><hr><div class=clearfix><div class="col-sm-17 article_movie_title"><h2><a href=https://www.rottentomatoes.com/m/superfly_2018/ >Superfly</a> <span class=subtle>(2018)</span> <span title=Rotten class="icon tiny rotten"></span> <span class=tMeterScore>51%</span></h2></div><a class="col-sm-7 col-xs-24 article_movie_poster" href=https://www.rottentomatoes.com/m/superfly_2018/ ><div><img class=article_poster src="https://resizing.flixster.com/ehj_8SBQXKPMqz8IrImI6itywlI=/180x267/v1.bTsxMjY5NjQ5NTtqOzE4ODgxOzIwNDg7MjAyNTszMDAw" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-17><div><p><p>Released in 1972, the original <em><a href=https://www.rottentomatoes.com/m/superfly>Superfly</a></em>&nbsp;helped lead the blaxploitation wave with a thoughtful Harlem-set drama about a drug dealer looking for one last big score; the movie’s trappings may look somewhat dated today, but thanks to <a href=https://www.rottentomatoes.com/celebrity/ron_oneal>Ron O’Neal</a>‘s performance as main character Youngblood Priest — not to mention a killer Curtis Mayfield soundtrack — it still feels fresh. It’s easy to understand why music video veteran <a href=https://www.rottentomatoes.com/celebrity/director_x>Director X</a> wanted to take a shot at updating the story, and its themes are just as relevant as they were more than 45 years ago; unfortunately, critics say those themes have mostly been lost in this new version, which is far more focused on style than substance. Starring Trevor Jackson as Priest, the 2018 edition moves the action to Atlanta, but the basic contours of the story remain the same — which is part of why a number of reviews have outlined pundits’ disappointment with the lost social subtext. This <a href=https://www.rottentomatoes.com/m/superfly_2018><em>Superfly</em></a>&nbsp;will make its fortune by and by, thanks to Director X’s way with an artfully arranged scene or set piece, but as is so often the case with remakes, the original still reigns supreme.<p></div></div></div><hr><h2><strong>What’s New on TV</strong></h2><div class=clearfix><div class="col-sm-20 article_tv_title"><h2><a href=//www.rottentomatoes.com/tv/the_bold_type/s02/ >The Bold Type: Season 2</a> <span class=subtle>(2018)</span> <span title="Certified Fresh" class="icon tiny certified"></span> <span class=tMeterScore>100%</span></h2></div><a class="col-sm-4 col-xs-24 article_tv_poster" href=//www.rottentomatoes.com/tv/the_bold_type/s02/ ><div><img class=article_poster src="https://resizing.flixster.com/xHMOoViBMja8NBKe9mRdzYiMPV4=/120x180/v1.dDszMDkxNzc7ajsxODg0MDsyMDQ4OzE3MDA7MjU1MA" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-20><div><p><p><a href=https://www.rottentomatoes.com/tv/the_bold_type/s02><em>The Bold Type</em></a> presents an aspirational yet refreshingly realistic portrait of young women’s careers, friendships and love lives in a big city.<p></div></div></div><hr><div class=clearfix><div class="col-sm-20 article_tv_title"><h2><a href=//www.rottentomatoes.com/tv/strange_angel/s01/ >Strange Angel: Season 1</a> <span class=subtle>(2018)</span> <span title=Fresh class="icon tiny fresh"></span> <span class=tMeterScore>71%</span></h2></div><a class="col-sm-4 col-xs-24 article_tv_poster" href=//www.rottentomatoes.com/tv/strange_angel/s01/ ><div><img class=article_poster src="https://resizing.flixster.com/95WlEL_q0lHyYaKmQzWnQDEkX84=/120x179/v1.dDszMDA3NDg7ajsxODgyNjsyMDQ4OzEwMDA7MTQ5Mw" alt="" sborder="" style=border-color:#eee;border-style:solid;border-width:1px></div></a><div class=col-sm-20><div><p><p>A beautiful slow burn, <a href=https://www.rottentomatoes.com/tv/strange_angel/s01><em>Strange Angel</em></a> shoots for the stars, but gets a little lost in its own orbit.<p></div></div></div><hr><p><strong>Also&nbsp;Opening This Week In Limited Release</strong><ul><li><span title="Certified Fresh" class="icon tiny certified"></span> <a href=https://www.rottentomatoes.com/m/eating_animals/ >Eating Animals </a><span class=subtle>(2018)</span> , a documentary about the commercial factory farming industry and its various impacts, is at 100%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/a_skin_so_soft/ >A Skin So Soft (Ta peau si lisse) </a><span class=subtle>(2018)</span> , a documentary look at the lives and gym habits of six bodybuilders, is at 100%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/the_year_of_spectacular_men/ >The Year of Spectacular Men </a><span class=subtle>(2018)</span> , a coming of age drama directed by <a href=https://www.rottentomatoes.com/celebrity/lea_thompson>Lea Thompson</a> and starring her daughters <a href=https://www.rottentomatoes.com/celebrity/zoey_deutch>Zoey</a> and <a href=https://www.rottentomatoes.com/celebrity/madelyn_deutch>Madelyn Deutch</a> (the latter of whom wrote the screenplay), is at 80%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/gabriel_and_the_mountain/ >Gabriel and the Mountain (Gabriel e a montanha) </a><span class=subtle>(2018)</span> , about a young man who sets out to travel the world before beginning college, is at 75%.<li><span title=Fresh class="icon tiny fresh"></span> <a href=https://www.rottentomatoes.com/m/five_seasons_the_gardens_of_piet_oudolf/ >Five Seasons: The Gardens Of Piet Oudolf </a><span class=subtle>(2018)</span> , a documentary about the aesthetics and public works of the titular plantsman, is at 71%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/the_yellow_birds/ >The Yellow Birds </a><span class=subtle>(2018)</span> , an Iraq War drama led by <a href=https://www.rottentomatoes.com/celebrity/alden-ehrenreich>Alden Ehrenreich</a> and <a href=https://www.rottentomatoes.com/celebrity/tye_sheridan>Tye Sheridan</a>, is at 44%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/loving_pablo/ >Loving Pablo </a><span class=subtle>(2018)</span> , starring <a href=https://www.rottentomatoes.com/celebrity/javier_bardem>Javier Bardem</a> and <a href=https://www.rottentomatoes.com/celebrity/penelope_cruz_2>Penélope Cruz</a> in a biopic about the love between drug kingpin Pablo Escobar and journalist Virginia Vallejo, is at 35%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/gotti_2018/ >Gotti </a><span class=subtle>(2018)</span> , starring <a href=https://www.rottentomatoes.com/celebrity/john_travolta>John Travolta</a> as infamous mob boss John Gotti, is at 0%.<li><span title=Rotten class="icon tiny rotten"></span> <a href=https://www.rottentomatoes.com/m/china_salesman/ >China Salesman </a><span class=subtle>(2018)</span> , an action adventure about a Chinese salesman who somehow becomes embroiled in an adventure that involves <a href=https://www.rottentomatoes.com/celebrity/steven_seagal>Steven Seagal</a> and <a href=https://www.rottentomatoes.com/celebrity/mike_tyson>Mike Tyson</a> punching one another, is at 0%.</ul></div></div>`;

const run = async () => {
  let list = await loadArray();
  list = list.map((item) => JSON.parse(item));
  for (const item of list) {
    const url = item.url;
    const title = item.title;
    try {
      // const data = await fetchData(url);
      // const $ = cheerio.load(data);
      const result = deepClone(skeleton);
      result.title = title;
      result.crawl_data.url = url;
      result.crawl_data.preview_poster =
        "https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/09/20131743/Ballistic-Ecks-Sever-Zeros.jpg";
      result.slug = result.crawl_data.url.split("/").reverse()[1];
      result.crawl_data.sections.push("Critics Consensus");
      let html = constHtml;
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
      result.content = html;
      const [res] = await knex("posts").insert(result).returning("*");
      if (res) console.log(res.id);
    } catch (err) {
      await fs.appendFileSync(
        "crawl-again.txt",
        JSON.stringify(item) + "\n",
        "utf8"
      );
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
