require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const logger = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');

// When the "strictQuery" option is set to true (the default), Mongoose only allows querying on fields that are explicitly defined in the schema. If the option is set to false, querying on any field is allowed, even if it is not defined in the schema.
mongoose.set('strictQuery', false);

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();
const mongoDB = process.env.MONGODB_URI;

//  The { useUnifiedTopology: true, useNewUrlParser: true } options passed to the mongoose.connect method are used to ensure that the latest recommended options are used when establishing a connection to the MongoDB server.
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('mongo connection error:', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
// This function is what will be called when we use the passport.authenticate() function
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    } catch (err) {
      return done(err);
    }
  })
);
// To make sure our user is logged in, and to allow them to stay logged in as they move around our app, passport will use some data to create a cookie which is stored in the user’s browser. These next two functions define what bit of information passport is looking for when it creates and then decodes the cookie.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
