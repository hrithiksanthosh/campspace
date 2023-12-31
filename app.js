if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

const express = require("express");
const { default: mongoose } = require("mongoose");
const { homedir } = require("os");
const app = express();
const ExpressError = require("./utilties/ExpressError");
const Joi = require("joi"); // for error
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override"); // for Put and Delete request
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

//routes
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

//connection to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

//Connection success or failed
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected ");
});

//for layout
//method override for put and delete request
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
//configuration of session
const sessionConfig = {
  name: "session",
  secret: "yoscrectkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 2487,
    maxAge: 1000 * 60 * 60 * 2487,
  },
};

app.use(session(sessionConfig));
app.use(flash());

//passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flashing the message
app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//routes

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

//error handler
app.all("*", (req, res, next) => {
  next(new ExpressError("page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No,Something Went Wrong!!";
  }
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("serving on port 3000");
});
