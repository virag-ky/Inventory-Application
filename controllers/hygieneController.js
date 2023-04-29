const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Hygiene = require('../models/hygiene');

// Get all hygiene products
exports.hygiene_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfHygieneProducts = await Hygiene.find().sort({
        date_added: -1,
      });
      res.render('hygiene/hygiene_list', {
        title: 'All hygiene products',
        user: req.user,
        list: listOfHygieneProducts,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
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

// Create new hygiene products
exports.hygiene_create_post = [
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
      const product = new Hygiene({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        user: req.user._id,
      });
      if (!errors.isEmpty()) {
        res.render('hygiene/hygiene_form', {
          title: 'Add new hygiene products',
          hygiene: product,
          user: req.user,
          errors: errors.array(),
        });
      } else {
        await product.save();
        const user = await User.findById(req.user._id).populate('hygiene');
        user.hygiene.push(product);
        await user.save();
        res.redirect(product.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get hygiene product details
exports.hygiene_details_get = async (req, res, next) => {
  try {
    const product = await Hygiene.findById(req.params.id).populate('user');
    if (product) {
      if (req.user) {
        res.render('hygiene/hygiene_details', {
          title: 'Details of the hygiene product:',
          hygiene: product,
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

// Delete the hygiene product
exports.hygiene_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }

    await Hygiene.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { hygiene: req.body.id } }
    );
    res.redirect('/hygiene');
  } catch (err) {
    next(err);
  }
};

// Display the hygiene update form
exports.hygiene_update_get = async (req, res, next) => {
  try {
    const product = await Hygiene.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('hygiene/hygiene_form', {
        title: 'Update hygiene product',
        hygiene: product,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the hygiene product
exports.hygiene_update_post = [
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
      const product = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
      };
      if (!errors.isEmpty()) {
        res.render('hygiene/hygiene_form', {
          title: 'Update hygiene product',
          hygiene: product,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Hygiene.findByIdAndUpdate(req.params.id, product, {});
      res.redirect(`/hygiene/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
