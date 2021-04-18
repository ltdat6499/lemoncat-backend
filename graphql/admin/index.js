const requireText = require("require-text");
const { makeExecutableSchema } = require("graphql-tools");
const { graphqlHTTP } = require("express-graphql");

const typeDefs = requireText("./schema.graphql", require);
const resolvers = require("./modules");
const scalars = require("../base/scalars");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: { ...scalars, ...resolvers },
});

module.exports = graphqlHTTP({
  schema,
  graphiql: true,
});
