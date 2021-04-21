const express = require("express");
const router = express.Router();

const admin = require("../graphql/admin");
const middlewares = require("../middlewares");
const auth = router.all("/oauth/callback", (req, res, next) => next());

module.exports = {
  admin,
  auth,
  middlewares,
};
