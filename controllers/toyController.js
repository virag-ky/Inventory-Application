const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Toy = require('../models/toy');

// Get all toys
exports.toy_list_get = async (req, res, next) => {
  try {
    const listOfToys = await Toy.find().sort({ date_added: -1 });
    res.render('toys/toy_list', {
      title: 'All toys',
      user: req.user,
      list: listOfToys,
    });
  } catch (err) {
    next(err);
  }
};
