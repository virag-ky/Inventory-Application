const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Clothing = require('../models/clothing');

// Get all clothes
exports.clothing_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfClothes = await Clothing.find().sort({ date_added: -1 });
      res.render('clothes/clothing_list', {
        title: 'All clothes',
        user: req.user,
        list: listOfClothes,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    next(err);
  }
};

// Display the clothing form
exports.clothing_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('clothes/clothing_form', {
      title: 'Add new clothes',
      user: req.user,
    });
  }
};

// Create new clothes
exports.clothing_create_post = [
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
    .custom((value) => value >= 1)
    .withMessage('You must add at least 1 item to the quantity field.')
    .escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const clothing = new Clothing({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
        size: req.body.size,
        clothing_type: req.body.type,
        user: req.user,
      });
      if (!errors.isEmpty()) {
        res.render('clothes/clothing_form', {
          title: 'Add new clothes',
          clothing,
          user: req.user,
          errors: errors.array(),
        });
        return;
      } else {
        await clothing.save();
        const user = await User.findById(req.user._id).populate(
          'clothes',
          'name'
        );
        user.clothes.push(clothing);
        await user.save();
        res.redirect(clothing.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get clothing details
exports.clothing_details_get = async (req, res, next) => {
  try {
    const clothing = await Clothing.findById(req.params.id).populate('user');
    if (clothing) {
      if (req.user) {
        res.render('clothes/clothing_details', {
          title: 'Details of the clothing:',
          clothing,
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

// Delete the clothing
exports.clothing_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await Clothing.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { clothes: req.body.id } }
    );
    res.redirect('/clothes');
  } catch (err) {
    next(err);
  }
};

// Display the clothing update form
exports.clothing_update_get = async (req, res, next) => {
  try {
    const clothing = await Clothing.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('clothes/clothing_form', {
        title: 'Update clothing',
        clothing,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the clothing
exports.clothing_update_post = [
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
      const clothing = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
        size: req.body.size,
        clothing_type: req.body.type,
      };
      if (!errors.isEmpty()) {
        res.render('clothes/clothing_form', {
          title: 'Update clothing',
          clothing,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Clothing.findByIdAndUpdate(req.params.id, clothing, {});
      res.redirect(`/clothes/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
