const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Hygiene = require('../models/hygiene');

// Get all hygiene products
exports.hygiene_list_get = async (req, res, next) => {
  try {
    const listOfHygieneProducts = await Hygiene.find().sort({ date_added: -1 });
    res.render('hygiene/hygiene_list', {
      title: 'All hygiene products',
      user: req.user,
      list: listOfHygieneProducts,
    });
  } catch (err) {
    next(err);
  }
};

// Display hygiene form
exports.hygiene_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('hygiene/hygiene_form', {
      title: 'Add new hygiene products',
      user: req.user,
    });
  }
};
