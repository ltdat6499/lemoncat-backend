const _ = require("lodash");
const cheerio = require("cheerio");
const { knex } = require("../../controllers");

const pathTrailer = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"hero-image",
	"button",
	"hero-image-poster",
	"div[slot='poster']",
];

const pathPoster = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"div[class='thumbnail-scoreboard-wrap']",
	"div[class='movie-thumbnail-wrap']",
	"div > button[id='poster_link'] > img",
];

const pathRealName = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"div[class='thumbnail-scoreboard-wrap']",
	"score-board > h1",
];

const pathCriticsCount = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"div[class='thumbnail-scoreboard-wrap']",
	"score-board > a[slot='critics-count']",
];

const pathAudienceCount = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"div[class='thumbnail-scoreboard-wrap']",
	"score-board > a[slot='audience-count']",
];

const pathHeader = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"div[class='thumbnail-scoreboard-wrap']",
	"score-board",
];

const pathWhatToKnow = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"section[id='what-to-know']",
	"div[class='what-to-know__body']",
	"section > p > span",
];

const pathWhereToWatchs = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"div[id='topSection']",
	"section[id='where-to-watch']",
	"div[class='where-to-watch__body']",
	"ul > li > a",
];

const pathSummary = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"section[class='panel panel-rt panel-box movie_info media']",
	"div[class='media-body']",
	"div[class='panel-body content_body']",
	"div[id='movieSynopsis']",
];

const pathInfo = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"section[class='panel panel-rt panel-box movie_info media']",
	"div[class='media-body']",
	"div[class='panel-body content_body']",
	"ul[class='content-meta info'] > li",
];

const pathCasts = [
	"div[class='body_main container']",
	"div[id='main_container']",
	"section[class='mob-body mob-body--no-hero-image']",
	"div[id='mainColumn']",
	"section[id='movie-cast']",
	"div[class='panel-body content_body']",
	"div[class='castSection ']",
	"div[data-qa='cast-crew-item']",
];
require("chromedriver");
const { Builder, until, By, Key } = require("selenium-webdriver");
const defaultTrailer =
	"https://www.mylilys.com/wp-content/uploads/2018/09/thumbnail-no-image-available.jpg";
const defaultAvatar =
	"/assets/pizza-pie/images/poster_default_thumbnail.2ec144e61b4.jpg";

const step1 = async () => {
	let source = await knex("crawlers_movies").select().where({ status: false });
	source = _.reverse(source);
	const driver = new Builder()
		.forBrowser("chrome")
		.usingServer("http://localhost:4444/wd/hub")
		.build();

	for (const movie of source) {
		console.log(">>>>> Load page");
		await driver.get("https://www.rottentomatoes.com" + movie.data.link);
		await driver.executeScript(
			"window.scrollTo(0, document.body.scrollHeight);"
		);
		// for (let i = 0; i < 20; i++) {
		// 	await driver
		// 		.findElement(
		// 			By.css(
		// 				"button[class='CarouselButton CarouselButton__left slick-arrow']"
		// 			)
		// 		)
		// 		.sendKeys(Key.ENTER);
		// }

		const html = await driver.getPageSource();

		console.log(">>>>> Craw page");

		const $ = cheerio.load(html);

		let trailer =
			($("body").find(pathTrailer.join(" > ")).attr("data-bg-srcset") + "")
				.trim()
				.split(", ")[1] || defaultTrailer;
		if (trailer !== defaultTrailer) {
			trailer = "https" + trailer.split("/https")[1];
		}

		const poster =
			"https" +
				($("body").find(pathPoster.join(" > ")).attr("src") + "")
					.trim()
					.split("/https")[1] ||
			"://media.istockphoto.com/vectors/no-image-available-icon-vector-id1216251206?k=20&m=1216251206&s=170667a&w=0&h=A72dFkHkDdSfmT6iWl6eMN9t_JZmqGeMoAycP-LMAw4=";

		const realName = (
			$("body").find(pathRealName.join(" > ")).text() + ""
		).trim();

		let criticsCount = $("body").find(pathCriticsCount.join(" > ")).text() + "";
		criticsCount = criticsCount
			.replace(",", "")
			.replace(" ", "")
			.replace("+", "")
			.replace("Reviews", "");
		criticsCount = Number(criticsCount.trim());

		let audienceCount =
			$("body").find(pathAudienceCount.join(" > ")).text() + "";
		audienceCount = audienceCount
			.replace(",", "")
			.replace(" ", "")
			.replace("+", "")
			.replace("Ratings", "");
		audienceCount = Number(audienceCount.trim());

		const rating = $("body").find(pathHeader.join(" > ")).attr("rating") + "";

		const audienceScore = Number(
			$("body").find(pathHeader.join(" > ")).attr("audiencescore") + ""
		);

		const whatToKnow = (
			$("body").find(pathWhatToKnow.join(" > ")).text() + ""
		).trim();

		const whereToWatchs = [];
		$("body")
			.find(pathWhereToWatchs.join(" > "))
			.each((index, el) => {
				whereToWatchs.push($(el).attr("data-affiliate"));
			});

		const summary = (
			$("body").find(pathSummary.join(" > ")).text() + ""
		).trim();

		const info = {};
		$("body")
			.find(pathInfo.join(" > "))
			.each((index, el) => {
				const keyName = (
					$(el).find("div[class='meta-label subtle']").text() + ""
				)
					.trim()
					.replace(":", "");
				switch (keyName) {
					case "Genre": {
						info.genres = (
							$(el).find("div[class='meta-value genre']").text() + ""
						)
							.split(", ")
							.map((item) => item.replace(/(\r\n|\n|\r)/gm, "").trim());
						break;
					}
					case "Original Language": {
						info.language = (
							$(el).find("div[class='meta-value']").text() + ""
						).trim();
						break;
					}
					case "Director": {
						info.directors = [];
						$(el)
							.find("div[class='meta-value'] > a")
							.each((i, e) => {
								info.directors.push({
									name: ($(e).text() + "").trim(),
									link: $(e).attr("href"),
								});
							});
						break;
					}
					case "Producer": {
						info.producers = [];
						$(el)
							.find("div[class='meta-value'] > a")
							.each((i, e) => {
								info.producers.push({
									name: ($(e).text() + "").trim(),
									link: $(e).attr("href"),
								});
							});
						break;
					}
					case "Writer": {
						info.writers = [];
						$(el)
							.find("div[class='meta-value'] > a")
							.each((i, e) => {
								info.writers.push({
									name: ($(e).text() + "").trim(),
									link: $(e).attr("href"),
								});
							});
						break;
					}
					case "Runtime": {
						info.runtime = (
							$(el).find("div[class='meta-value']").text() + ""
						).trim();
						break;
					}
					case "Distributor": {
						info.distributor = (
							$(el).find("div[class='meta-value']").text() + ""
						).trim();
						break;
					}
					case "Sound Mix": {
						info.soundMixs = ($(el).find("div[class='meta-value']").text() + "")
							.trim()
							.split(", ");
						break;
					}
					case "Aspect Ratio": {
						info.aspectRatio = (
							$(el).find("div[class='meta-value']").text() + ""
						).trim();
						break;
					}
					default: {
						if (keyName.includes("Release Date (Theaters)"))
							info.theaterAt = (
								$(el).find("div[class='meta-value']").text() + ""
							)
								.replace(/(\r\n|\n|\r)/gm, "")
								.replace(/\s\s+/g, " ")
								.trim();
						else if (keyName.includes("Release Date (Streaming)"))
							info.streamingAt = (
								$(el).find("div[class='meta-value']").text() + ""
							).trim();
						else if (keyName.includes("Box Office"))
							info.boxOffice = (
								$(el).find("div[class='meta-value']").text() + ""
							).trim();
						break;
					}
				}
			});

		const casts = [];
		$("body")
			.find(pathCasts.join(" > "))
			.each((index, el) => {
				const link = $(el).find("div[class='pull-left'] > a").attr("href");
				let avatar =
					$(el).find("div[class='pull-left'] > a > img").attr("data-src") + "";
				if (avatar !== defaultAvatar) {
					avatar = "https" + avatar.split("/https")[1];
				}
				const castName = (
					$(el).find("div[class='media-body'] > a > span").text() + ""
				).trim();
				const characterName = (
					$(el).find("div[class='media-body'] > span").text() + ""
				)
					.replace(/(\r\n|\n|\r)/gm, "")
					.replace(/\s\s+/g, " ")
					.trim();

				casts.push({
					castName,
					link,
					avatar,
					characterName,
				});
			});

		await knex("result_movies").insert({
			data: {
				name: movie.data.name,
				link: movie.data.link,
				year: movie.data.year,
				trailer,
				poster,
				realName,
				criticsCount,
				audienceCount,
				criticScore: Number(movie.data.score.replace("%", "")),
				audienceScore,
				rating,
				whatToKnow,
				whereToWatchs,
				summary,
				info,
				casts,
			},
		});
		await knex("crawlers_movies")
			.update({
				status: true,
			})
			.where({ id: movie.id });
	}
	await driver.quit();
};

step1();
