const moment = require("moment");
const { knex } = require("../../controllers");

const phase1 = async () => {
	let casts = await knex("result_casts").select();
	casts = casts.map((item) => ({
		name: item.data.name,
		birth: (() => {
			if (
				(!(new Date(item.data.birthday) !== "Invalid Date") &&
					!isNaN(new Date(item.data.birthday))) ||
				item.data.birthday === "" ||
				item.data.birthday === "Not Available"
			)
				return moment("01-01-1960");
			return moment(item.data.birthday);
		})(),
		born_in: item.data.birthplace,
		summary: item.data.summary,
		images: item.data.images,
		slug: item.data.link.replace("/celebrity/", ""),
		data: {},
	}));

	let i,
		j,
		list = [],
		chunk = 200;
	for (i = 0, j = casts.length; i < j; i += chunk) {
		list.push(knex("persons").insert(casts.slice(i, i + chunk)));
	}

	const startTime = performance.now();

	try {
		await Promise.all(list);
	} catch (error) {
		console.log(error);
	}

	const endTime = performance.now();
	console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
};

phase1();
