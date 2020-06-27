let express = require("express");
let router = express.Router();
let Campground = require("./../models/campground");
let Comment = require("./../models/comment");
//REST: INDEX
router.get("/", (req, res) => {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) console.log(err);
    else {
      res.render("./campground/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
});

//

//REST: NEW
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./campground/form", {
    currentUser: req.user,
  });
});

//REST: POST
router.post("/", isLoggedIn, (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.desc;
  let author = {
    id: req.user.id,
    username: req.user.username,
  };
  let camp = {
    name: name,
    img: image,
    desc: desc,
    author: author,
  };
  Campground.create(camp, function (err, newCamp) {
    console.log(camp);
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});

//REST: SHOw
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) console.log(err);
      else {
        res.render("./campground/show", {
          foundCampground: foundCampground,
          currentUser: req.user,
        });
      }
    });
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
