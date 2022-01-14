const moment = require("moment");
const faker = require("faker");
const _ = require("lodash");
const { knex } = require("../../controllers");

const phase1 = async () => {
	let movies = await knex("result_movies").select();
	const casts = await knex("persons").select();

	movies = movies.map((item) => ({
		id: item.id,
		type: "movie",
		info: {
			name: item.realName,
			tags: [],
			genres: _.defaults(_.omitBy(item.info.genres, _.isNull), []),
			poster:
				item.poster ||
				"https://i.pinimg.com/originals/f6/ed/ca/f6edcac5e2c675512d005b43144960af.jpg",
			rating: item.rating || "PG13",
			runtime: _.defaults(_.omitBy(item.info.runtime, _.isNull), "2h"),
			summary: item.summary || faker.lorem.paragraphs(2),
			trailer:
				item.trailer ||
				"https://moviebabble.com/wp-content/uploads/2019/03/Movie-Previews.jpg",
			collection: "",
			soundMixs: _.defaults(_.omitBy(item.info.soundMixs, _.isNull), [
				"Dolby Digital",
			]),
			productions: _.defaults(_.omitBy(item.info.distributor, _.isNull), "")
				.replace(/(\r\n|\n|\r)/gm, "")
				.replace(/\s\s+/g, " ")
				.trim()
				.split(", "),
			aspectRatio: _.defaults(
				_.omitBy(item.info.aspectRatio, _.isNull),
				"Scope (2.35:1)"
			),
			theatersDate: _.defaults(
				_.omitBy(item.info.theaterAt, _.isNull),
				"20-12-2015"
			).replace(" wide", ""),
			streamingDate: _.defaults(
				_.omitBy(item.info.streamingAt, _.isNull),
				"20-12-2015"
			),
			originalLanguage: _.defaults(
				_.omitBy(item.info.language, _.isNull),
				"English"
			),
		},
		whatToKnows: [
			{
				title: "Critic",
				content: item.whatToKnow || faker.lorem.paragraphs(1),
			},
		],
		streamings: item.whereToWatchs,
		photos: [],
		crews: [...item.casts.map()],

		slug: item.data.link.replace("/m/", ""),
	}));

	// let i,
	// 	j,
	// 	list = [],
	// 	chunk = 200;
	// for (i = 0, j = movies.length; i < j; i += chunk) {
	// 	list.push(knex("persons").insert(movies.slice(i, i + chunk)));
	// }

	// const startTime = performance.now();

	// try {
	// 	await Promise.all(list);
	// } catch (error) {
	// 	console.log(error);
	// }

	// const endTime = performance.now();
	// console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
};

phase1();
