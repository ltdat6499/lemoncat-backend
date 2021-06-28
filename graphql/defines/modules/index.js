const _ = require("lodash");

const modules = [
  require("./users"),
  require("./actions"),
  require("./flims"),
  require("./persons"),
  require("./posts"),
  // require("./awards"),
];
const resolvers = modules.reduce((list = {}, items) => _.merge(list, items));

module.exports = resolvers;
