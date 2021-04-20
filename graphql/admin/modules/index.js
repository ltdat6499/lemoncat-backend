const _ = require("lodash");

const modules = [
  require("./users"),
  require("./comments"),
  require("./movies"),
  require("./persons"),
  require("./posts"),
  require("./productions"),
  require("./tops"),
];
const resolvers = modules.reduce((list = {}, items) => _.merge(list, items));

module.exports = resolvers;
