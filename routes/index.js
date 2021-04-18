const express = require("express");
const router = express.Router();

const admin = require("../graphql/admin");

const auth = router.all("/oauth/callback", (req, res, next) => next());

module.exports = {
  admin,
  auth,
};
