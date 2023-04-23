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

// Display the bed form
exports.bed_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('beds/bed_form', { title: 'Add new beds', user: req.user });
  }
};
