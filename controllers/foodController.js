const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Food = require('../models/food');

// Get all food
exports.food_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfFood = await Food.find().sort({ date_added: -1 });
      res.render('food/food_list', {
        title: 'All food',
        user: req.user,
        list: listOfFood,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    next(err);
  }
};

// Display food form
exports.food_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('food/food_form', { title: 'Add new food', user: req.user });
  }
};

// Create new food
exports.food_create_post = [
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
      const meal = new Food({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        flavor: req.body.flavor,
        weight: req.body.weight,
        food_type: req.body.type,
        user: req.user._id,
      });
      if (!errors.isEmpty()) {
        res.render('food/food_form', {
          title: 'Add new food',
          food: meal,
          user: req.user,
          errors: errors.array(),
        });
      } else {
        await meal.save();
        const user = await User.findById(req.user._id).populate('food');
        user.food.push(meal);
        await user.save();
        res.redirect(meal.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get food details
exports.food_details_get = async (req, res, next) => {
  try {
    const meal = await Food.findById(req.params.id).populate('user');
    if (meal) {
      if (req.user) {
        res.render('food/food_details', {
          title: 'Details of the food:',
          food: meal,
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

// Delete the food
exports.food_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await Food.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { food: req.body.id } }
    );
    res.redirect('/food');
  } catch (err) {
    next(err);
  }
};

// Display the food update form
exports.food_update_get = async (req, res, next) => {
  try {
    const meal = await Food.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('food/food_form', {
        title: 'Update food',
        food: meal,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the food
exports.food_update_post = [
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
      const food = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        flavor: req.body.flavor,
        food_type: req.body.type,
        weight: req.body.weight,
      };
      if (!errors.isEmpty()) {
        res.render('food/food_form', {
          title: 'Update food',
          food,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Food.findByIdAndUpdate(req.params.id, food, {});
      res.redirect(`/food/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
