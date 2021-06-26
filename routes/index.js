const graphql = require("../graphql/defines");

const login = (req, res) => {
  res.render("login");
};

const logout = (req, res) => {
  req.logOut();
  return true;
};

module.exports = {
  graphql,
  login,
  logout,
};
