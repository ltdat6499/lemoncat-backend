require("dotenv").config({ path: "../.env" });

module.exports = {
  signatureKey: process.env.JWT_KEY,
};
