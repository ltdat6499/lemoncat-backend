const _ = require("lodash");
const cheerio = require("cheerio");
const { knex } = require("../../controllers");

require("chromedriver");
const { Builder, until, By, Key } = require("selenium-webdriver");

const pathBirthday = [
	"div[class='container roma-layout__body']",
	"main[id='main_container']",
	"div[id='main-page-content']",
	"div[class='layout celebrity']",
	"article[class='layout__column layout__column--main']",
	"section > div[class=' celebrity-bio']",
	"div[class='celebrity-bio__content']",
	"div[class='celebrity-bio__info']",
	"p[data-qa='celebrity-bio-bday']",
];

const pathBirthplace = [
	"div[class='container roma-layout__body']",
	"main[id='main_container']",
	"div[id='main-page-content']",
	"div[class='layout celebrity']",
	"article[class='layout__column layout__column--main']",
	"section > div[class=' celebrity-bio']",
	"div[class='celebrity-bio__content']",
	"div[class='celebrity-bio__info']",
	"p[data-qa='celebrity-bio-birthplace']",
];

const pathSummary = [
	"div[class='container roma-layout__body']",
	"main[id='main_container']",
	"div[id='main-page-content']",
	"div[class='layout celebrity']",
	"article[class='layout__column layout__column--main']",
	"section > div[class=' celebrity-bio']",
	"div[class='celebrity-bio__content']",
	"div[class='celebrity-bio__info']",
	"p[data-qa='celebrity-bio-summary']",
];

const pathImages = [
	"div[class='container roma-layout__body']",
	"main[id='main_container']",
	"div[id='main-page-content']",
	"div[class='layout celebrity']",
	"article[class='layout__column layout__column--main']",
	"section[class='celebrity-photos']",
	"div[class='celebrity-photos__wrap']",
	"div[id='celebrity-photo-slider']",
	"ul[class='Carousel js-celebrity-media-carousel-init slick-initialized slick-slider slick-dotted']",
	"div[class='slick-list draggable']",
	"div[class='slick-track'] > li > button > img",
];

const step1 = async () => {
	let data = await knex("result_movies").select("data");
	data = data.map((item) => item.data.casts);

	let results = [];

	for (const item of data) {
		for (const cast of item) {
			results.push({
				data: {
					link: cast.link,
					castName: cast.castName,
				},
			});
		}
	}

	results = results.filter((v, i, a) => {
		console.log(i);
		return a.findIndex((t) => t.data.link === v.data.link) === i;
	});

	const res = await knex("crawler_casts").insert(results);
	console.log(res);
};

const step2 = async () => {
	let casts = await knex("crawler_casts").select().where({
		status: false,
	});
	const driver = new Builder()
		.forBrowser("chrome")
		.usingServer("http://localhost:4444/wd/hub")
		.build();

	for (const cast of casts) {
		console.log(">>>>> Load page");
		await driver.get("https://www.rottentomatoes.com" + cast.data.link);
		await driver.executeScript(
			"window.scrollTo(0, document.body.scrollHeight);"
		);
		let noImages = true;
		try {
			for (let i = 0; i < 20; i++) {
				await driver
					.findElement(
						By.css(
							"button[class='celebrity-photos__carousel-button celebrity-photos__carousel-button--prev slick-arrow']"
						)
					)
					.sendKeys(Key.ENTER);
			}
		} catch (error) {
			noImages = false;
		}

		const html = await driver.getPageSource();

		console.log(">>>>> Craw page");

		const $ = cheerio.load(html);
		const name = cast.data.castName;
		const link = cast.data.link;
		const birthday = ($("body").find(pathBirthday.join(" > ")).text() + "")
			.replace(/(\r\n|\n|\r)/gm, "")
			.replace(/\s\s+/g, " ")
			.replace("Birthday: ", "")
			.trim();
		const birthplace = ($("body").find(pathBirthplace.join(" > ")).text() + "")
			.replace(/(\r\n|\n|\r)/gm, "")
			.replace(/\s\s+/g, " ")
			.replace("Birthplace: ", "")
			.trim();
		const summary = ($("body").find(pathSummary.join(" > ")).text() + "")
			.replace(/(\r\n|\n|\r)/gm, "")
			.replace(/\s\s+/g, " ")
			.trim();

		const images = [];
		if (noImages)
			$("body")
				.find(pathImages.join(" > "))
				.each((index, el) => {
					let image =
						"https://" + ($(el).attr("src") + "").split("/http://")[1] + "";
					images.push(image);
				});
		console.log({
			name,
			birthday,
			birthplace,
			summary,
			images,
			link,
		});
		await knex("result_casts").insert({
			data: {
				name,
				birthday,
				birthplace,
				summary,
				images,
				link,
			},
		});

		await knex("crawler_casts")
			.update({
				status: true,
			})
			.where({
				id: cast.id,
			});
	}

	await driver.quit();
};

step2();
