const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const flickr = require("../../plugins/flickr");
const config = require("../../configs");
const tools = require("../../global");
const controller = require("../../controllers");
const jwt = require("../jwt");

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const local = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
    session: false,
  },
  async (req, email, password, done) => {
    const user = tools._.head(await controller.users.getByParams({ email }));
    if (!user) return done(null, false, { message: "Incorrect email." });
    const passwordVerify = await tools.checkPassword(password, user.password);
    if (!passwordVerify)
      return done(null, false, { message: "Incorrect password." });
    return done(null, jwt.sign({ id: user.id }, config.signatureKey));
  }
);

const google = new GoogleStrategy(
  {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    session: false,
  },
  async (token, tokenSecret, profile, done) => {
    if (token && profile) {
      let user = await controller.users.getByParams({
        email: profile._json.email,
      });
      if (user.length <= 0) {
        const id = tools.genId();
        await sleep(500);
        user = await controller.users.create({
          id,
          name: profile.displayName,
          email: profile._json.email,
          image: JSON.stringify({
            id: tools.genId(),
            src: profile._json.picture,
          }),
          status: true,
          elo: {},
          otp: {},
          login_data: JSON.stringify({
            ...profile._json,
            token,
          }),
        });
      } else {
        user = tools._.head(user);
      }
      return done(null, jwt.sign({ id: user.id }, config.signatureKey));
    }
    return done("login error");
  }
);
const facebook = new FacebookStrategy(
  {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    session: false,
    profileFields: ["id", "email", "link", "name"],
  },
  async (accessToken, refreshToken, profile, done) => {
    if (accessToken && profile) {
      let user = await controller.users.getByParams({
        email: profile._json.email,
      });
      if (user.length <= 0) {
        const id = tools.genId();
        const path = __dirname + `/../../downloads/${profile._json.id}.jpeg`;
        await tools.download(
          `https://graph.facebook.com/${profile._json.id}/picture?type=large&access_token=${accessToken}`,
          path,
          async () => {
            const avataInfo = await flickr.upload(`${profile._json.id}.jpeg`);
            await tools.deleteFile(path);
            if (avataInfo) {
              user = await controller.users.create({
                id,
                name: profile._json.first_name + " " + profile._json.last_name,
                email: profile._json.email,
                image: JSON.stringify(avataInfo),
                status: true,
                elo: {},
                otp: {},
                login_data: JSON.stringify({
                  ...profile._json,
                  accessToken,
                }),
              });
            }
          }
        );
      } else {
        user = tools._.head(user);
      }
      return done(null, jwt.sign({ id: user.id }, config.signatureKey));
    }
    return done("login error");
  }
);

const serialize = (token, done) => {
  done(null, token);
};

const deserialize = async (token, done) => {
  try {
    const { data, err } = jwt.verify(token, config.signatureKey);
    if (err) return done(err);
    const user = await controller.users.getById(data.id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const exportPassport = {
  local: passport.authenticate("local", {
    failureRedirect: "/login",
    session: false,
  }),
  facebookAuth: passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["user_friends"],
  }),
  facebookCallback: passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuth: passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  }),
  googleCallback: passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
};

module.exports = {
  exportPassport,
  setup: {
    local,
    facebook,
    google,
    serialize,
    deserialize,
  },
};
