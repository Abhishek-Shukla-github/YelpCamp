let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require("./models/comment");
let data = [
  {
    name: "Khardung la Pass",
    img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR2nR2qTp307oEKyuX_-AbomfH3TwQEZwN7QAOKi9MednKJoSxu&usqp=CAU",
    desc:
      "China is fkin big time here at such a bleautiful place and also Gufraan bhai has done his shit here!",
  },
  {
    name: "Mount Assiniboine Provincial Park",
    img:
      "https://img.huffingtonpost.com/asset/5cd5d6e32100003500c2dc75.jpeg?ops=scalefit_960_noupscale&format=webp",
    desc:
      "Mount Assiniboine Provincial Park is dubbed as a magnificent place of shimmering lakes, glistening glaciers, sky-scraping peaks and sun-dappled alpine meadows",
  },
  {
    name: "Mount Robson Provincial Park",
    img:
      "https://img.huffingtonpost.com/asset/5cd5d6e3200000300098f0ca.jpeg?ops=scalefit_960_noupscale&format=webp",
    desc:
      'Mount Robson Provincial Park, the second oldest park in the province\'s park system, is one of the world’s " crown jewels." This UNESCO World Heritage site is the tallest in the Canadian Rockies and is prone to changing seasons.',
  },
];

let seedDB = () => {
  Campground.remove({}, (err) => {
    if (err) console.log(err);
    else {
      console.log("Removed all the campgrounds!");
      data.forEach((seed) => {
        Campground.create(seed, (err, createdCampground) => {
          if (err) console.log(err);
          else {
            console.log("Created a Campgrounds!");
            Comment.create(
              {
                text: "Canada is Awesome!",
                author: "Abhisheeeek",
              },
              (err, comment) => {
                if (err) console.log(err);
                else {
                  createdCampground.comments.push(comment);
                  createdCampground.save();
                  console.log("Added comment");
                }
              }
            );
          }
        });
      });
    }
  });
};

module.exports = seedDB;
