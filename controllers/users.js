const User = require("../models/user");

module.exports.renderRegisterationForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password); // register to db using passport
    req.login(registeredUser, (err) => {
      if (err) return next(err); // to redirecct to login
      req.flash("success", "User registered Successfully");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  req.flash("success", "Successfully loged in");
  res.redirect(redirectUrl);
};

module.exports.deleteuser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged out");
    res.redirect("/campgrounds");
  });
};
