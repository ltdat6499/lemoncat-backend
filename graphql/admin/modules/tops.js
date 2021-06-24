const { tops } = require("../../../controllers");
const tools = require("../../../global");

module.exports = {
  Query: {
    // async tops() {
    //   return await tops.getAll();
    // },
    // async top(__, args) {
    //   const { id } = args;
    //   return await tops.getById(id);
    // },
  },
  Mutation: {
    // async createTop(__, { input }) {
    //   input.id = tools.genId();
    //   input = tools.changeCaseType(input, "snakeCase");
    //   const [result] = await tops.create(input);
    //   return result;
    // },
    // async updateTop(__, args) {
    //   const { input, id } = args;
    //   const [result] = await tops.update(
    //     id,
    //     tools.changeCaseType(input, "snakeCase")
    //   );
    //   return result;
    // },
    // async deleteTop(__, { id }) {
    //   const result = await tops.deleteById(id);
    //   return result.length;
    // },
  },
  // Top: {
  //   createdAt: (parent) => parent.created_at,
  //   updatedAt: (parent) => parent.updated_at,
  // },
  // TopInput: {
  //   createdAt: (parent) => parent.created_at,
  //   updatedAt: (parent) => parent.updated_at,
  // },
};
