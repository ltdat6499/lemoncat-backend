require("dotenv").config();

module.exports = {
  google: {
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
  },
};
