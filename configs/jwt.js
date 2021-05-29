require("dotenv").config();

module.exports = {
  signatureKey: process.env.JWT_KEY,
};
