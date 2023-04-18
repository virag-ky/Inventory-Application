const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Display create new user form
exports.user_create_get = (req, res) => {
  res.render('new_user', { title: 'New User' });
};

// Create new user
exports.user_create_post = async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: passwordHash,
    });
    await user.save();
    res.redirect(
      '/login/?message=Please,%20login%20with%20your%20newly%20created%20username.'
    );
  } catch (err) {
    res.render('new_user', {
      error: 'This username already exists, choose another name.',
    });
    return next(err);
  }
};

// Display login form
exports.user_login_get = (req, res) => {
  res.render('login', { title: 'Login', message: req.query.message });
};

// Login the user
// This middleware performs numerous functions behind the scenes. Among other things, it looks at the request body for parameters named username and password then runs the LocalStrategy function that we defined earlier to see if the username and password are in the database. It then creates a session cookie that gets stored in the user’s browser, and that we can access in all future requests to see whether or not that user is logged in.
exports.user_login_post = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Invalid username or password');
      const errorMsg = req.flash('error');
      return res.render('login', { title: 'Login', errorMsg });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};

// Logout
// the passport middleware adds a logout function to the req object
exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
