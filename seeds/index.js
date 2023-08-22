const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected ");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;

    const camp = new Campground({
      author: "6478f066c00abaea9e1959b1",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      location: `${cities[random1000].city},${cities[random1000].population}`,
      title: `${sample(descriptors)}${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, dignissimos molestiae optio vitae soluta reiciendis quaerat hic perspiciatis dolorum.",
      price,
      images: [
        {
          url: "https://images.unsplash.com/photo-1690228835779-8482c60093bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
          filename: "YELPCAMP/t7t6wi6bw6brwzm2adcl",
        },
      ],
    });
    await camp.save();
  }
};

seedDB();
