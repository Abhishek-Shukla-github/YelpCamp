let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
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
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  //Check if User is Logged in
  if (req.isAuthenticated()) {
    //Check if User owns the comment or not
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) res.redirect("back");
      else {
        if (foundComment.author.id.equals(req.user.id)) {
          next();
        } else res.redirect("back");
      }
    });
  } else res.redirect("back");
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login to perform this operation");
  return res.redirect("/login");
};

module.exports = middlewareObj;
