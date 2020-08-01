let express = require("express");
let router = express.Router();
let Campground = require("./../models/campground");
let Comment = require("./../models/comment");
let middleware = require("../middleware/index");
let multer = require("multer");
require("dotenv").config();
let storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
let imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });

let cloudinary = require("cloudinary");
const campground = require("./../models/campground");
const { checkCampgroundOwnership } = require("../middleware/index");
cloudinary.config({
  cloud_name: "prof-noob123",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

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
  res.render("./campground/new", {
    currentUser: req.user,
  });
});

//REST: POST
router.post("/", middleware.isLoggedIn, upload.single("image"), (req, res) => {
  // let name = req.body.name;
  // let img = req.body.img;
  // let desc = req.body.desc;
  // let price = req.body.price;
  cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
    // add cloudinary url for the image to the campground object under image property
    req.body.campground.image = result.secure_url;
    req.body.campground.imageId = result.public_id;
    // add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username,
    };
    // let author = {
    //   id: req.user.id,
    //   username: req.user.username,
    // };
    // let camp = {
    //   price: price,
    //   name: name,
    //   img: img,
    //   desc: desc,
    //   author: author,
    // };
    Campground.create(req.body.campground, function (err, newCamp) {
      if (err) console.log(err);
      else {
        req.flash("success", "Successfully created Campground!");
        res.redirect("/");
      }
    });
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
// router.put(
//   "/:id",
//   middleware.checkCampgroundOwnership,
//   upload.single("image"),
//   (req, res) => {
//     if (req.file) {
//       cloudinary.v2.uploader.destroy(campground.imageId, function (
//         err,
//         result
//       ) {});
//       Campground.findByIdAndUpdate(
//         req.params.id,
//         req.body.campground,
//         function (err, updatedCampground) {
//           if (err) {
//             req.flash("error", "Cannot save the changes");
//             res.redirect("/campgrounds");
//           } else {
//             req.flash("success", "Saved the changes in campground");
//             res.redirect("/campgrounds/" + req.params.id);
//           }
//         }
//       );
//     }
//   }
// );

router.put("/:id", checkCampgroundOwnership, upload.single("image"), function (
  req,
  res
) {
  Campground.findById(req.params.id, async function (err, campground) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      if (req.file) {
        try {
          await cloudinary.v2.uploader.destroy(campground.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          campground.imageId = result.public_id;
          campground.image = result.secure_url;
        } catch (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
      }
      campground.name = req.body.campground.name;
      campground.desc = req.body.campground.desc;
      campground.price = req.body.campground.price;
      campground.save();
      req.flash("success", "Successfully Updated!");
      res.redirect("/campgrounds/" + campground._id);
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
