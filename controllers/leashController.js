const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Leash = require('../models/leash');

// Get all leashes
exports.leash_list_get = async (req, res, next) => {
  try {
    const listOfLeashes = await Leash.find().sort({ date_added: -1 });
    res.render('leashes/leash_list', {
      title: 'All leashes',
      user: req.user,
      list: listOfLeashes,
    });
  } catch (err) {
    next(err);
  }
};

// Display leash form
exports.leash_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('leashes/leash_form', {
      title: 'Add new leashes',
      user: req.user,
    });
  }
};
