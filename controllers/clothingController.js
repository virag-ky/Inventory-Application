const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Clothing = require('../models/clothing');

// Get all clothes
exports.clothing_list_get = async (req, res, next) => {
  try {
    const listOfClothes = await Clothing.find().sort({ date_added: -1 });
    res.render('clothes/clothing_list', {
      title: 'All clothes',
      user: req.user,
      list: listOfClothes,
    });
  } catch (err) {
    next(err);
  }
};

// Display the clothing form
exports.clothing_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('clothes/clothing_form', {
      title: 'Add new clothes',
      user: req.user,
    });
  }
};
