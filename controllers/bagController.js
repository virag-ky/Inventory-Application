const { body, validationResult } = require('express-validator');
const Bag = require('../models/bag');

// Get all bags
exports.bag_list_get = async (req, res, next) => {
  try {
    const listOfBags = await Bag.find({})
      .sort({ date_added: -1 })
      .populate('user');

    res.render('bags/bag_list', {
      title: 'All bags',
      list: listOfBags,
      user: req.user.username,
    });
  } catch (err) {
    res.redirect('/');
    next(err);
  }
};

// Display the bag form
exports.bag_create_get = (req, res) => {
  res.render('bags/bag_form', {
    title: 'Add new bags',
    user: req.user.username,
  });
};

// Create a new bag
exports.bag_create_post = async (req, res, next) => {
  try {
    body('name', 'Name must not be empty.')
      .trim()
      .isLength({ min: 3, max: 20 })
      .escape(),
      body('description', 'Description must not be empty.')
        .trim()
        .isLength({ min: 10, max: 50 })
        .escape(),
      body('price', 'Price must not be empty.').trim().isDecimal().escape(),
      body('quantity', 'Quantity must not be empty.')
        .trim()
        .isNumeric()
        .escape();
    const errors = validationResult(req);
    const bag = new Bag({
      pet: req.body.pet,
      name: req.body.name,
      description: req.body.description,
      bag_type: req.body.type,
      size: req.body.size,
      color: req.body.color,
      price: req.body.price,
      number_in_stock: req.body.quantity,
      user: req.user,
    });
    if (!errors.isEmpty()) {
      res.render('bags/bag_form', {
        title: 'Add new bags',
        bag,
        errors: errors.array(),
        user: req.user.username,
      });
      return;
    }
    await bag.save();
    res.redirect(bag.url);
  } catch (err) {
    // res.redirect('/');
    next(err);
  }
};

// Get the bag's details
exports.bag_details_get = async (req, res, next) => {
  try {
    const bag = await Bag.findById(req.params.id).populate('user');
    if (bag) {
      res.render('bags/bag_details', {
        title: 'Details of the bag:',
        bag,
        user: req.user.username,
      });
    }
  } catch (err) {
    res.redirect('/');
    next(err);
  }
};
