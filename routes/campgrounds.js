let express = require("express");
let router = express.Router();
let Campground = require("./../models/campground");
let Comment = require("./../models/comment");
let middleware = require("../middleware/index");
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("./campground/form", {
    currentUser: req.user,
  });
});

//REST: POST
router.post("/", middleware.isLoggedIn, (req, res) => {
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
      req.flash("success", "Successfully created Campground!");
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) res.redirect("/" + foundCampground._id + "/edit");
    else {
      res.render("campground/edit", { foundCampground, foundCampground });
    }
  });
});

//Saving the CHanges
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      req.flash("error", "Cannot save the changes");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Saved the changes in campground");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Deleting a camoground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndDelete(req.params.id, function (
    err,
    deletedCAmpground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Successfully Deleted the campground!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
