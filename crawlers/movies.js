const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");
const { knex } = require("../controllers");

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

const step1 = async () => {
	const results = [];
	for (let i = 1950; i <= 2021; i++) {
		const html = await axios.get(
			"https://www.rottentomatoes.com/top/bestofrt/?year=" + i
		);

		const $ = cheerio.load(html.data);
		$("body")
			.find(base.join(" > "))
			.each(async (index, el) => {
				results.push({
					link: $(el).find(link.join(" > ")).attr("href"),
					name: $(el).find(link.join(" > ")).text().trim(),
					score: $(el).find(score.join(" > ")).text().trim(),
					reviews: $(el).find(reviews.join(" > ")).text().trim(),
					year: i,
				});
			});
		console.log(i);
	}
	await fs.appendFileSync(`movies.json`, JSON.stringify(results), "utf8");
};

const step2 = async () => {
	let data = await fs.readFileSync("./movies.json");
	data = JSON.parse(data);
	data = data.map((item) => ({ data: item }));

	await knex("crawlers_movies").insert(data);
	console.log("done");
};
