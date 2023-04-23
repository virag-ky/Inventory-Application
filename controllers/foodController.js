const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Food = require('../models/food');

// Get all food
exports.food_list_get = async (req, res, next) => {
  try {
    const listOfFood = await Food.find().sort({ date_added: -1 });
    res.render('food/food_list', {
      title: 'All food',
      user: req.user,
      list: listOfFood,
    });
  } catch (err) {
    next(err);
  }
};

// Display food form
exports.food_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('food/food_form', { title: 'Add new food', user: req.user });
  }
};
