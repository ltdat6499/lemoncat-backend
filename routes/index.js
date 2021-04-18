const express = require("express");
const router = express.Router();

const { graphqlHTTP } = require("express-graphql");

const adminGraphql = require("../graphql/admin");

const auth = router.all("/oauth/callback", (req, res, next) => next());

module.exports = {
  admin: graphqlHTTP(adminGraphql),
  auth,
};
