let express = require("express");
let router = express.Router();
let flash = require("connect-flash");
let passport = require("passport");

let User = require("./../models/user");
//SignUp form
router.get("/register", (req, res) => {
  res.render("register");
});

//SignUp Logic
router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Welcome to the Yelpcamp ," + user.username + "!");
        res.redirect("/campgrounds");
      });
    }
  });
});

//Login Form
router.get("/login", (req, res) => {
  res.render("login");
});

//Login Logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log("bjhvjkhbkjbk");
    req.flash("success", "Welcome again!");
  }
);

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
