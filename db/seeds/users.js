const tools = require("../../global/");

exports.seed = async (knex) => {
  const list = [];
  for (const id of tools.userIds) {
    list.push({
      id,
      email: tools.genEmail(),
      password: await tools.hashPassword("lemoncat"),
      name: tools.genName(),
      image: {
        id: tools.genFakeId(),
        src: tools.genAvatar(),
      },
      token: "",
      status: !!tools.getRandomBetween(-1, 2),
      role: tools.getRandomBetween(-1, 2) === true ? "s-user" : "user",
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
