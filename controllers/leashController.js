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
