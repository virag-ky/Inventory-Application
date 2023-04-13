const User = require('../models/user');
const async = require('async');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
            return cb(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          return cb(null, user);
        }
      );
    });
  })
);

exports.user_create_get = (req, res, next) => {
  res.render('new_user');
};

exports.user_login_get = (req, res, next) => {
  res.render('login');
};

exports.user_login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};
