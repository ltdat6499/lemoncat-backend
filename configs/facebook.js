require("dotenv").config();

module.exports = {
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/facebook/callback`,
  },
};
