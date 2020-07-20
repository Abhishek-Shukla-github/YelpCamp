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
  let img = req.body.img;
  let desc = req.body.desc;
  let author = {
    id: req.user.id,
    username: req.user.username,
  };
  let camp = {
    name: name,
    img: img,
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

//Edit Route
//Displaying the form
router.get("/:id/edit", checkUserOwnership, (req, res) => {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) res.redirect("/" + foundCampground._id + "/edit");
    else {
      res.render("campground/edit", { foundCampground, foundCampground });
    }
  });
});

//Saving the CHanges
router.put("/:id", checkUserOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) res.redirect("/campgrounds");
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

//Deleting a camoground
router.delete("/:id", checkUserOwnership, (req, res) => {
  Campground.findByIdAndDelete(req.params.id, function (
    err,
    deletedCAmpground
  ) {
    if (err) res.redirect("/cmapgrounds");
    else res.redirect("/campgrounds");
  });
});

//Middleware
//Preventing actions if not logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

//Auhtorization Middleware
function checkUserOwnership(req, res, next) {
  //Check if the user is Logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) res.redirect("/");
      else {
        //Check if the user owns the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else res.redirect("back");
      }
    });
  } else res.redirect("back");
}

module.exports = router;
