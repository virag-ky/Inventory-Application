const { body, validationResult } = require('express-validator');
const Bag = require('../models/bag');

exports.bag_list_get = async (req, res, next) => {
  try {
    const listOfBags = await Bag.find({})
      .sort({ date_added: -1 })
      .populate('user');

    res.render('bags/bag_list', { title: 'All bags', list: listOfBags });
  } catch (err) {
    next(err);
  }
};

exports.bag_create_get = (req, res) => {
  res.render('bags/bag_form', {
    title: 'Add new bags',
    user: req.user.username,
  });
};

exports.bag_create_post = [
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3, max: 20 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 10, max: 50 })
    .escape(),
  body('price', 'Price must not be empty.').trim().isDecimal().escape(),
  body('quantity', 'Quantity must not be empty.').trim().isNumeric().escape(),
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
      }
      bag.save();
      res.redirect(bag.url);
    } catch (err) {
      next(err);
    }
  },
];
