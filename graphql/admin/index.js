const requireText = require("require-text");
const { buildSchema } = require("graphql");

const typeDefs = requireText("./schema.graphql", require);
const modules = require("./modules");
const scalars = require("../base/scalars");

module.exports = {
  schema: buildSchema(typeDefs),
  rootValue: {
    ...scalars,
    ...modules.resolvers,
  },
  graphiql: true,
};
