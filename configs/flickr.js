require("dotenv").config();
module.exports = {
  flickr: {
    consumerKey: process.env.FLICKR_CONSUMER_KEY,
    consumerSecret: process.env.FLICKR_CONSUMER_SECRET,
    oauthToken: process.env.FLICKR_OAUTH_TOKEN,
    oauthSecret: process.env.FLICKR_OAUTH_TOKEN_SECRET,
  },
};
