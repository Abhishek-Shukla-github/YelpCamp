let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user.js"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment"),
  Campground = require("./models/campground"),
  commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index"),
  flash = require("connect-flash");

require("dotenv").config();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useUnifiedTopology", true);
// mongoose.connect("mongodb://localhost/YelpcampAuth", { useNewUrlParser: true });
// mongoose.createConnection("mongodb://localhost/Yelpcamp", {
//   useNewUrlParser: true,
// });
// MONGODB SETUP
console.log("database: " + process.env.DATABASEURL);
const mongooseConnectString = process.env.DATABASEURL;

mongoose
  .connect(mongooseConnectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to DB " + process.env.DATABASEURL);
  })
  .catch((err) => {
    console.log("ERROR:", err.message);
  });

// seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//Passport Configuration
app.use(
  require("express-session")({
    // secret: "Ivar the Boneless!",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.get("/", (req, res) => {
  res.render("./campground/landing");
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, () => {
  console.log("Yelpcamp running on port 3000!");
});
