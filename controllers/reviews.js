const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deletereview = async (req, res, next) => {
  const { id, reviewid } = req.params;

  // Remove the review from the reviews array of the campground
  const campground = await Campground.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewid } },
    { new: true }
  );

  // Delete the review from the database
  await Review.findByIdAndDelete(reviewid);

  req.flash("success", "Successfully Deleted");
  res.redirect(`/campgrounds/${id}`);
};
