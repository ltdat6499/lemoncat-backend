const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const config = require("../../configs");
const users = require("../../controllers/users");
const tools = require("../../global");
const session = require("express-session");
const flash = require("connect-flash");

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
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await users.getById(id);
  if (!user) return done(err);
  return done(null, user);
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

const login = app.post(
  "/login",
  passport.authenticate("local", {
    successFlash: "Welcome!",
    session: true,
  }),
  (req, res) => {
    res.json({ message: req.flash() });
  }
);

module.exports = {
  login,
};
