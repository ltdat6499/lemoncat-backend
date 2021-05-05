const express = require("express");
const axios = require("axios").default;
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const jwt = require("../jwt");
const config = require("../../configs");
const users = require("../../controllers/users");
const tools = require("../../global");
const fs = require("fs");
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      const user = tools._.head(await users.getByParams({ email }));
      if (!user) return done(null, false, { message: "Incorrect email." });
      const passwordVerify = await tools.checkPassword(password, user.password);
      if (!passwordVerify)
        return done(null, false, { message: "Incorrect password." });
      return done(null, jwt.sign({ id: user.id }, config.signatureKey));
    }
  )
);

const fetchData = async (url) => {
  try {
    const response = await axios({
      url,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    // console.log("Axios error");
  }
};

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      session: false,
      profileFields: ["id", "email", "link", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      if (accessToken && profile) {
        console.log(profile._json);
        const user = tools._.head(
          await users.getByParams({ email: profile._json.email })
        );
        if (!user) {
          const id = tools.genId();
          await tools.download(
            `https://graph.facebook.com/${profile._json.id}/picture?type=large&access_token=${accessToken}`,
            __dirname + `/../../downloads/${profile._json.id}.jpeg`,
            () => {
              console.log("✅ Done!");
            }
          );

          // const [result] = await users.create({
          //   id,
          // });
        }
      }
      return done(null, profile);
    }
  )
);

passport.serializeUser((token, done) => {
  done(null, token);
});

passport.deserializeUser(async (token, done) => {
  try {
    const { data, err } = jwt.verify(token, config.signatureKey);
    if (err) return done(err);
    const user = await users.getById(data.id);
    console.log(token);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.use(require("morgan")("combined"));
app.use(
  session({
    secret: config.signatureKey,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const login = app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    successFlash: "Welcome!",
    session: true,
  });
  return res.redirect("/");
});

const facebookAuth = app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["user_friends"],
  })
);

const facebookCallback = app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = {
  login,
  facebookAuth,
  facebookCallback,
};
