const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Leash = require('../models/leash');

// Get all leashes
exports.leash_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfLeashes = await Leash.find().sort({ date_added: -1 });
      res.render('leashes/leash_list', {
        title: 'All leashes',
        user: req.user,
        list: listOfLeashes,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    next(err);
  }
};

// Display leash form
exports.leash_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('leashes/leash_form', {
      title: 'Add new leashes',
      user: req.user,
    });
  }
};

// Create new leashes
exports.leash_create_post = [
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
    .custom((value) => value >= 1)
    .withMessage('You must add at least 1 item to the quantity field.')
    .escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const leash = new Leash({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
        user: req.user,
      });
      if (!errors.isEmpty()) {
        res.render('leashes/leash_form', {
          title: 'Add new leashes',
          leash,
          user: req.user,
          errors: errors.array(),
        });
      } else {
        await leash.save();
        const user = await User.findById(req.user._id).populate('leashes');
        user.leashes.push(leash);
        await user.save();
        res.redirect(leash.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get leash details
exports.leash_details_get = async (req, res, next) => {
  try {
    const leash = await Leash.findById(req.params.id).populate('user');
    if (leash) {
      if (req.user) {
        res.render('leashes/leash_details', {
          title: 'Details of the leash:',
          leash,
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

// Delete the leash
exports.leash_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await Leash.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { leashes: req.body.id } }
    );
    res.redirect('/leashes');
  } catch (err) {
    next(err);
  }
};

// Display the update form
exports.leash_update_get = async (req, res, next) => {
  try {
    const leash = await Leash.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('leashes/leash_form', {
        title: 'Update leash',
        leash,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the leash
exports.leash_update_post = [
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
      const leash = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
      };
      if (!errors.isEmpty()) {
        res.render('leashes/leash_form', {
          title: 'Update leash',
          leash,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Leash.findByIdAndUpdate(req.params.id, leash, {});
      res.redirect(`/leashes/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
