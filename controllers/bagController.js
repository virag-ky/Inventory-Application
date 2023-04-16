const { body, validationResult } = require('express-validator');
const Bag = require('../models/bag');

exports.bag_list_get = async (req, res, next) => {
  try {
    const listOfBags = await Bag.find({}).sort({ number_in_stock: 1 });
    res.render('bags/bag_list', { title: 'All bags', list: listOfBags });
  } catch (err) {
    next(err);
  }
};
