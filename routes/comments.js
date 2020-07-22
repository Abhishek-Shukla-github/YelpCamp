let express = require("express");
let router = express.Router({ mergeParams: true });
let Campground = require("./../models/campground");
let Comment = require("./../models/comment");
let middleware = require("../middleware/index");

//New comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else {
      //Create Comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", err);
        } else {
          //Add Username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //Save the comment
          comment.save();

          foundCampground.comments.push(comment);
          foundCampground.save();
          req.flash("success", "Comment Added!");
          res.redirect("/campgrounds/" + foundCampground._id);
          console.log(comment);
        }
      });
    }
  });
});

//Edit Routes
//Displaying the edit form
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash("error", "You don't have permission to do that");
        res.redirect("back");
      } else {
        res.render("comment/edit", {
          campground_id: req.params.id,
          foundComment: foundComment,
        });
      }
    });
  }
);

//Posting/saving the changes
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) res.redirect("back");
    else {
      req.flash("success", "Changes in the Comment saved!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Delete Route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function (
    err,
    deletedComment
  ) {
    if (err) res.redirect("back");
    else {
      req.flash("success", "Comment Deleted Successfully");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
