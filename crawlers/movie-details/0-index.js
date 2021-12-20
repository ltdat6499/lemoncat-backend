const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");

(async () => {
	let movies = await fs.readFileSync("../movies.json", "utf8");
	movies = JSON.parse(movies);

	// for (const movie of movies) {
	// }

	// const results = [];
	// for (let i = 2021; i <= 2021; i++) {
	// 	const html = await axios.get(
	// 		"https://www.rottentomatoes.com" + i
	// 	);

	// 	const $ = cheerio.load(html.data);
	// 	$("body")
	// 		.find(base.join(" > "))
	// 		.each(async (index, el) => {
	// 			results.push({
	// 				name: $(el).find(link.join(" > ")).attr("href"),
	// 				link: $(el).find(link.join(" > ")).text().trim(),
	// 				score: $(el).find(score.join(" > ")).text().trim(),
	// 				reviews: $(el).find(reviews.join(" > ")).text().trim(),
	// 			});
	// 		});
	// 	console.log(i);
	// }
	// await fs.appendFileSync(`movies.json`, JSON.stringify(results), "utf8");
})();
