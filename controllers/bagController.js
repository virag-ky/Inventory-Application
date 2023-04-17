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
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('bags/bag_form', {
      title: 'Add new bags',
      user: req.user.username,
    });
  }
};

// Create a new bag
exports.bag_create_post = [
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage('Name must be between 3-25 characters long.')
    .isAlpha()
    .withMessage('Name must only contain letters.')
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Description must be between 10-200 characters long.')
    .isAlpha()
    .withMessage('Description must only contain letters.')
    .escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isDecimal()
    .custom((value) => value >= 0.01)
    .withMessage('Price must be greater than $0.')
    .escape(),
  body('quantity', 'Quantity must not be empty.')
    .trim()
    .isNumeric()
    .toInt()
    .custom((value) => value >= 1)
    .withMessage('You must add at least 1 item in the quantity field.')
    .escape(),
  async (req, res, next) => {
    try {
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
      } else {
        await bag.save();
        res.redirect(bag.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get the bag's details
exports.bag_details_get = async (req, res, next) => {
  try {
    const bag = await Bag.findById(req.params.id).populate('user');
    if (bag) {
      if (req.user) {
        res.render('bags/bag_details', {
          title: 'Details of the bag:',
          bag,
          user: req.user.username,
        });
        return;
      }
      res.redirect('/login');
    }
  } catch (err) {
    next(err);
  }
};

// Delete the bag
exports.bag_delete = async (req, res, next) => {
  try {
    await Bag.findByIdAndRemove(req.body.id);
    res.redirect('/bags');
  } catch (err) {
    next(err);
  }
};
