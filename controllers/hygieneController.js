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
