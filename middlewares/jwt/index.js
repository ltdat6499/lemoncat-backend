const jwt = require("jsonwebtoken");

const sign = (data, key) => jwt.sign(data, key, { expiresIn: "7d" });

const verify = (token, key) =>
  jwt.verify(token, key, (err, data) => {
    if (!err) return { data, err: [] };
    return { data: {}, err };
  });

module.exports = {
  sign,
  verify,
};
