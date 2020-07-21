let express = require("express");
let router = express.Router({ mergeParams: true });
let Campground = require("./../models/campground");
let Comment = require("./../models/comment");

//New comment
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log("ERrrrrrrrrrrrrrrrrrrror");
    else {
      res.render("comment/new", {
        campground: campground,
        currentUser: req.user,
      });
    }
  });
});

// Create comment
router.post("/", isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else {
      //Create Comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          //Add Username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //Save the comment
          comment.save();

          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground._id);
          console.log(comment);
        }
      });
    }
  });
});

//Edit Routes
//Displaying the edit form
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) res.redirect("back");
    else {
      res.render("comment/edit", {
        campground_id: req.params.id,
        foundComment: foundComment,
      });
    }
  });
});

//Posting/saving the changes
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) res.redirect("back");
    else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Delete Route
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function (
    err,
    deletedComment
  ) {
    if (err) res.redirect("back");
    else res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
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
}

module.exports = router;
