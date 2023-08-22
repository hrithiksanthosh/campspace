const express = require("express");
const router = express.Router({ mergeParams: true });
const getAsync = require("../utilties/getAysnc");
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", validateReview, isLoggedIn, getAsync(reviews.createReview));

// Remove the review from the reviews array of the campground

router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  getAsync(reviews.deletereview)
);

module.exports = router;
