const snakecaseKeys = require("snakecase-keys");
const faker = require("faker");
const _ = require("lodash");
const { knex } = require("../../controllers");

const phase1 = async () => {
	let movies = await knex("result_movies").select();
	const casts = await knex("persons").select();
	const total = movies.length;
	let counter = 1;

	for (let item of movies) {
		item = item.data;
		item.poster ??=
			"https://i.pinimg.com/originals/f6/ed/ca/f6edcac5e2c675512d005b43144960af.jpg";
		item.rating ??= "PG13";
		item.summary ??= faker.lorem.paragraphs(2);
		item.trailer ??=
			"https://moviebabble.com/wp-content/uploads/2019/03/Movie-Previews.jpg";
		item.info ??= {};
		item.info.distributor ??= "";
		item.info.soundMixs ??= ["Dolby Digital"];
		item.info.runtime ??= "2h";
		item.info.aspectRatio ??= "Scope (2.35:1)";
		item.info.theaterAt ??= "20-12-2015";
		item.info.streamingAt ??= "20-12-2015";
		item.info.language ??= "English";
		item.whatToKnow ??= faker.lorem.paragraphs(1);

		const input = snakecaseKeys({
			id: item.id,
			type: "movie",
			info: {
				name: item.realName,
				tags: [],
				genres: item.info.genres,
				poster: item.poster,
				rating: item.rating,
				runtime: item.info.runtime,
				summary: item.summary,
				trailer: item.trailer,
				collection: "",
				soundMixs: item.info.soundMixs,
				productions: item.info.distributor
					.replace(/(\r\n|\n|\r)/gm, "")
					.replace(/\s\s+/g, " ")
					.trim()
					.split(", "),
				aspectRatio: item.info.aspectRatio,
				theatersDate: item.info.theaterAt.replace(" wide", ""),
				streamingDate: item.info.streamingAt,
				originalLanguage: item.info.language,
			},
			whatToKnows: [
				{
					title: "Critic",
					content: item.whatToKnow,
				},
			],
			streamings: item.whereToWatchs,
			photos: [],
			crews: item.casts.map((i) => {
				const cast = casts.find((p) => {
					if (i.link) return p.slug === i.link.replace("/celebrity/", "");
				});
				if (cast)
					return {
						role: i.characterName,
						person: cast.id,
					};
			}),
			quotes: [
				{ name: faker.lorem.words(3), content: faker.lorem.paragraphs(3) },
				{ name: faker.lorem.words(3), content: faker.lorem.paragraphs(3) },
			],
			data: {
				news: [],
				trailerPhoto: item.trailer,
				rottenTomatoes: {
					audienceScore: item.audienceScore,
					tomatometerScore: item.criticScore,
				},
			},
			userScore: item.audienceScore || 0,
			lemonScore: item.criticScore || 0,
			slug: item.link.replace("/m/", ""),
		});

		await knex("flims").insert(input);
		console.log(`${counter++} / ${total}`);
	}

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
