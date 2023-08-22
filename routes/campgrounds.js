const express = require("express");
const router = express.Router();
const getAsync = require("../utilties/getAysnc");
const ExpressError = require("../utilties/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validatecampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(getAsync(campgrounds.index)) //get the campgrounds
  .post(
    isLoggedIn,
    upload.array("image"),
    validatecampground,
    getAsync(campgrounds.createCampground)
  ); //create new campground
// .post(upload.array("image"), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("wurked");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(getAsync(campgrounds.showCampground)) //find campground
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validatecampground,
    getAsync(campgrounds.updateCampground)
  ) // Update Campground
  .delete(isAuthor, getAsync(campgrounds.deleteCampground));
//delete Campground

//edit campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  getAsync(campgrounds.renderEditForm)
);

module.exports = router;
