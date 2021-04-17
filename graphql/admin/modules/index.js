const _ = require("lodash");

const modules = [require("./users")];

const mergeAll = (items) => _.reduce(items, _.merge);
const resolvers = mergeAll(modules.map((m) => m.resolvers));
const schemaDefs = mergeAll(modules.map((m) => m.schemaDefs));

module.exports = {
  resolvers,
  schemaDefs,
};
