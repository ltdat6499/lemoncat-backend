const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const router = require("./routes");
const app = express();
const session = require("express-session");
const passport = require("passport");
const configs = require("./configs");
const { setup, exportPassport } = require("./middlewares/").passports;

app.use(cors());
// session configuration
app.use(
  session({
    secret: configs.signatureKey,
    cookie: {},
    resave: false,
    saveUninitialized: false,
  })
);

// passport configuration
passport.use(setup.local);
passport.use(setup.facebook);
passport.use(setup.google);
passport.serializeUser(setup.serialize);
passport.deserializeUser(setup.deserialize);

app.use(passport.initialize());
app.use(passport.session());

// view engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "downloads")));


app.post("/login", exportPassport.local, (req, res) => res.send(req.user));
app.get("/login", (req, res) => res.send("auth failed"));
app.get("/auth/facebook", exportPassport.facebookAuth);
app.get(
  "/auth/facebook/callback",
  exportPassport.facebookCallback,
  (req, res) => res.redirect("http://localhost:3842/#/login?token=" + req.user)
);
app.get("/auth/google", exportPassport.googleAuth);
app.get("/auth/google/callback", exportPassport.googleCallback, (req, res) =>
  res.redirect("http://localhost:3842/#/login?token=" + req.user)
);

app.use("/admin-graphql", router.admin);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler configuration
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

module.exports = app;
