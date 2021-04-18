const tools = require("../../global/");

exports.seed = async (knex) => {
  const list = [];
  for (let i = 1; i <= 100; i++) {
    list.push({
      id: i,
      email: tools.genEmail(),
      password: await tools.helpers.hashPassword("lemoncat"),
      name: tools.genName(),
      image: {
        id: tools.genId(),
        src: tools.genAvatar(),
      },
      token: "",
      status: !!tools.getRandomBetween(-1, 2),
      role: i % 10 === 0 ? "s-user" : "user",
      elo: {},
      otp: "",
    });
  }
  return await knex("users")
    .del()
    .then(async () => {
      await knex("users").insert(list);
    });
};
