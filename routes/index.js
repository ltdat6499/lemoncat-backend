const admin = require("../graphql/admin");

const login = (req, res) => {
  res.render("login");
};

const logout = (req, res) => {
  req.logOut();
  return true;
};

module.exports = {
  admin,
  login,
  logout,
};
