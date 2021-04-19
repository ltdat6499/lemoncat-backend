const _ = require("lodash");

const modules = [require("./users"), require("./comments")];
const resolvers = modules.reduce((list = {}, items) => _.merge(list, items));

module.exports = resolvers;
