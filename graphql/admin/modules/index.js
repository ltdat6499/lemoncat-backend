const _ = require("lodash");

const modules = [require("./users")];
const resolvers = modules.reduce((list = {}, items) => _.merge(list, items));

module.exports = resolvers;
