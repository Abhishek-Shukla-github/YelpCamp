let express = require("express");
let router = express.Router();
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
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
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
  (req, res) => {}
);

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

//Preventing actions if not logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
