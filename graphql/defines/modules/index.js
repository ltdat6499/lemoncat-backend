const _ = require("lodash");

const modules = [
  require("./users"),
  require("./comments"),
  require("./flims"),
  require("./persons"),
  require("./posts"),
  require("./tops"),
];
const resolvers = modules.reduce((list = {}, items) => _.merge(list, items));

module.exports = resolvers;
