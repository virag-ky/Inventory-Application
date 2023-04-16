const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.user_create_get = (req, res) => {
  res.render('new_user');
};

(exports.user_create_post = async (req, res, next) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  try {
    const user = new User({
      username: req.body.username,
      password: passwordHash,
    });
    await user.save();
    res.redirect(`/?greeting=Welcome%20${user.username}!`);
  } catch (err) {
    return next(err);
  }
}),
  (exports.user_login_get = (req, res) => {
    res.render('login');
  });

// This middleware performs numerous functions behind the scenes. Among other things, it looks at the request body for parameters named username and password then runs the LocalStrategy function that we defined earlier to see if the username and password are in the database. It then creates a session cookie that gets stored in the user’s browser, and that we can access in all future requests to see whether or not that user is logged in.
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});

// the passport middleware adds a logout function to the req object
exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
