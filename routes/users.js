const express = require("express");
const router = express.Router();
const getAsync = require("../utilties/getAysnc");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegisterationForm)
  .post(getAsync(users.registerUser));

//login

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    storeReturnTo, // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    passport.authenticate("local", {
      // passport.authenticate logs the user in and clears req.session
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.deleteuser);

module.exports = router;
