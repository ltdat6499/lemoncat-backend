const _ = require("lodash");

const modules = [
  require("./users"),
  require("./comments"),
  require("./movies"),
];
const resolvers = modules.reduce((list = {}, items) => _.merge(list, items));

module.exports = resolvers;
