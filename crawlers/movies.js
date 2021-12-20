const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");

const base = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"div[class='col-left-center col-full-xs']",
	"section[id='top_movies_main']",
	"div[class='panel-body content_body allow-overflow']",
	"table[class='table']",
	"tbody > tr",
];

const link = ["td > a"];

const score = [
	"td",
	"span[class='tMeterIcon tiny']",
	"span[class='tMeterScore']",
];

const reviews = ["td[class='right hidden-xs']"];
(async () => {
	const results = [];
	for (let i = 2021; i <= 2021; i++) {
		const html = await axios.get(
			"https://www.rottentomatoes.com/top/bestofrt/?year=" + i
		);

		const $ = cheerio.load(html.data);
		$("body")
			.find(base.join(" > "))
			.each(async (index, el) => {
				results.push({
					name: $(el).find(link.join(" > ")).attr("href"),
					link: $(el).find(link.join(" > ")).text().trim(),
					score: $(el).find(score.join(" > ")).text().trim(),
					reviews: $(el).find(reviews.join(" > ")).text().trim(),
				});
			});
		console.log(i);
	}
	await fs.appendFileSync(`movies.json`, JSON.stringify(results), "utf8");
})();
