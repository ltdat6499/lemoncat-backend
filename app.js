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
const jwt = require("./middlewares/jwt/");
const controller = require("./controllers");
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
app.post("/profile", async (req, res) => {
  const { data, err } = jwt.verify(req.body.token, configs.signatureKey);
  if (err.length) return res.json({ error: err });
  if (data.id) {
    const user = await controller.getById("users", data.id);
    return res.json({ data: user });
  }
  return res.json({ data: {} });
});
app.get("/genIds", async (req, res) => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    const id = await controller.knex.raw("select lemoncat.next_id() as id");
    results.push(id.rows[0].id);
  }
  return res.json(results);
});
app.use("/graphql", router.graphql);

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
