const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Toy = require('../models/toy');

// Get all toys
exports.toy_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfToys = await Toy.find().sort({ date_added: -1 });
      res.render('toys/toy_list', {
        title: 'All toys',
        user: req.user,
        list: listOfToys,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    next(err);
  }
};

// Display toy form
exports.toy_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('toys/toy_form', { title: 'Add new toys', user: req.user });
  }
};

// Create new toys
exports.toy_create_post = [
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
      const toy = new Toy({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        user: req.user,
      });
      if (!errors.isEmpty()) {
        res.render('toys/toy_form', {
          title: 'Add new toys',
          toy,
          user: req.user,
          errors: errors.array(),
        });
      } else {
        await toy.save();
        const user = await User.findById(req.user._id).populate('toys');
        user.toys.push(toy);
        await user.save();
        res.redirect(toy.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get toy details
exports.toy_details_get = async (req, res, next) => {
  try {
    const toy = await Toy.findById(req.params.id).populate('user');
    if (toy) {
      if (req.user) {
        res.render('toys/toy_details', {
          title: 'Details of the toy:',
          toy,
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

// Delete the toy
exports.toy_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await Toy.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { toys: req.body.id } }
    );
    res.redirect('/toys');
  } catch (err) {
    next(err);
  }
};

// Display the toy update form
exports.toy_update_get = async (req, res, next) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('toys/toy_form', {
        title: 'Update toy',
        toy,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the toy
exports.toy_update_post = [
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
      const toy = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
      };
      if (!errors.isEmpty()) {
        res.render('toys/toy_form', {
          title: 'Update toy',
          toy,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Toy.findByIdAndUpdate(req.params.id, toy, {});
      res.redirect(`/toys/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
