const admin = require("../graphql/admin");

const login = (req, res) => {
  res.render("login");
};
module.exports = {
  admin,
  login,
};
