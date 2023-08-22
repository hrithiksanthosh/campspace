const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const {
  Client: GoogleMapsClient,
} = require("@googlemaps/google-maps-services-js");
// require('dotenv').config(); // Load environment variables from .env file

const googleMapsClient = new GoogleMapsClient({});
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  try {
    const geocodeResult = await googleMapsClient.geocode({
      params: {
        address: campground.location,
        key: process.env.GOOGLEMAP_APIKEY,
      },
      timeout: 1000, // Timeout in milliseconds (adjust as needed)
    });

    const location = geocodeResult.data.results[0].geometry.location;
    const coordinates = [location.lng, location.lat];
    const geoJsonCoordinates = {
      type: "Point",
      coordinates: coordinates,
    };
    campground.geometry = geoJsonCoordinates;

    campground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully created a new campground.");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Failed to create the campground.");
    res.redirect("/campgrounds");
  }
};

// module.exports.createCampground = async (req, res, next) => {
//   const campground = new Campground(req.body.campground);
//   campground.images = req.files.map((f) => ({
//     // campground model has image property with following names
//     url: f.path,
//     filename: f.filename,
//   })); // path and  filename is taken from file property
//   campground.author = req.user._id;
//   req.flash("success", "successfully made new camp");
//   await campground.save();
//   console.log(campground);
//   res.redirect(`/campgrounds/${campground._id}`);
// };

module.exports.showCampground = async (req, res) => {
  const id = req.params.id;
  const campgrounds = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!campgrounds) {
    req.flash("error", "Campground doesnt exist");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campgrounds });
};

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const campgrounds = await Campground.findById(id);
  if (!campgrounds) {
    req.flash("error", "Campground doesnt exist");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campgrounds });
};

module.exports.updateCampground = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    // campground model has image property with following names
    url: f.path,
    filename: f.filename,
  })); // to avoid arrary-array
  campground.images.push(...imgs); // spread operator saves copy
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "successfully Updated");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted");
  res.redirect(`/campgrounds`);
};
