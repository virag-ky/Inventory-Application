const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Bed = require('../models/bed');

// Get all beds
exports.beds_list_get = async (req, res, next) => {
  try {
    const listOfBeds = await Bed.find().sort({ date_added: -1 });
    res.render('beds/bed_list', {
      title: 'All beds',
      user: req.user,
      list: listOfBeds,
    });
  } catch (err) {
    next(err);
  }
};
