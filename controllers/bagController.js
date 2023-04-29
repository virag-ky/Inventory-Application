const { body, validationResult } = require('express-validator');
const Bag = require('../models/bag');
const User = require('../models/user');

// Get all bags
exports.bag_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfBags = await Bag.find().sort({ date_added: -1 });
      res.render('bags/bag_list', {
        title: 'All bags/carriers',
        list: listOfBags,
        user: req.user,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    res.redirect('/login/?message=Session%20expired.');
    next(err);
  }
};

// Display the bag form
exports.bag_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('bags/bag_form', {
      title: 'Add new bags/carriers',
      user: req.user,
    });
  }
};

// Create a new bag
exports.bag_create_post = [
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage('Name must be between 3-25 characters long.')
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Description must be between 10-200 characters long.')
    .escape(),
  body('price', 'Price must not be empty.')
    // number being checked must have between 1 and 3 decimal digits, inclusive
    .isDecimal({ decimal_digits: '1,3' })
    .custom((value) => value >= 0.01)
    .withMessage('Price must be greater than $0.')
    .escape(),
  body('quantity', 'Quantity must not be empty.')
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
        user: req.user._id,
      });
      if (!errors.isEmpty()) {
        res.render('bags/bag_form', {
          title: 'Add new bags',
          bag,
          errors: errors.array(),
          user: req.user,
        });
        return;
      } else {
        await bag.save();
        const user = await User.findById(req.user._id).populate('bags', 'name');
        user.bags.push(bag);
        await user.save();
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
          title: 'Details of the bag/carrier:',
          bag,
          user: req.user,
        });
        return;
      }
      res.redirect('/login/?message=Session%20expired.');
    }
  } catch (err) {
    next(err);
  }
};

// Delete the bag
exports.bag_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await Bag.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { bags: req.body.id } }
    );
    res.redirect('/bags');
  } catch (err) {
    next(err);
  }
};

// Display the update form
exports.bag_update_get = async (req, res, next) => {
  try {
    const bag = await Bag.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('bags/bag_form', {
        title: 'Update bag/carrier',
        bag,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the bag
exports.bag_update_post = [
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage('Name must be between 3-25 characters long.')
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Description must be between 10-200 characters long.')
    .escape(),
  body('price', 'Price must not be empty.')
    .isDecimal({ decimal_digits: '1,3' })
    .custom((value) => value >= 0.01)
    .withMessage('Price must be greater than $0.')
    .escape(),
  body('quantity', 'Quantity must not be empty.')
    .isNumeric()
    .toInt()
    .custom((value) => value > 0)
    .withMessage('You must add at least 1 item in the quantity field.'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const bag = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
        size: req.body.size,
        bag_type: req.body.type,
      };
      if (!errors.isEmpty()) {
        res.render('bags/bag_form', {
          title: 'Update bag/carrier',
          bag,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Bag.findByIdAndUpdate(req.params.id, bag, {});
      res.redirect(`/bags/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
