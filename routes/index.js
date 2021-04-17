// const express = require("express");
// const router = express.Router();

const { graphqlHTTP } = require("express-graphql");

const adminGraphql = require("../graphql/admin");

module.exports = {
  admin: graphqlHTTP(adminGraphql),
};
