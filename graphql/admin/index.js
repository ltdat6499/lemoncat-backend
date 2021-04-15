const adapter = require("join-monster-graphql-tools-adapter");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs = require("./schema");
const modules = require("./modules");
const scalars = require("../base/scalars");

const resolvers = {
  ...scalars,
  ...modules.resolvers,
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
adapter(schema, modules.jmDefs);

module.exports = schema;
