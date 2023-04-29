const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Bed = require('../models/bed');

// Get all beds
exports.beds_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfBeds = await Bed.find().sort({ date_added: -1 });
      res.render('beds/bed_list', {
        title: 'All beds',
        user: req.user,
        list: listOfBeds,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    next(err);
  }
};

// Display the bed form
exports.bed_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('beds/bed_form', { title: 'Add new beds', user: req.user });
  }
};

// Create a new bed
exports.bed_create_post = [
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
    .trim()
    .isDecimal({ decimal_digits: '1,3' })
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
      const bed = new Bed({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        size: req.body.size,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        user: req.user._id,
      });
      if (!errors.isEmpty()) {
        res.render('beds/bed_form', {
          title: 'Add new beds',
          user: req.user,
          bed,
          errors: errors.array(),
        });
        return;
      } else {
        await bed.save();
        const user = await User.findById(req.user._id).populate('beds', 'name');
        user.beds.push(bed);
        await user.save();
        res.redirect(bed.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get the bed's details
exports.bed_details_get = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id).populate('user');
    if (bed) {
      if (req.user) {
        res.render('beds/bed_details', {
          title: 'Details of the bed:',
          bed,
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

// Delete the bed
exports.bed_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await Bed.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { beds: req.body.id } }
    );
    res.redirect('/beds');
  } catch (err) {
    next(err);
  }
};

// Display the bed update form
exports.bed_update_get = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('beds/bed_form', {
        title: 'Update bed',
        bed,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the bed
exports.bed_update_post = [
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
      const bed = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
        size: req.body.size,
      };
      if (!errors.isEmpty()) {
        res.render('beds/bed_form', {
          title: 'Update bed',
          bed,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await Bed.findByIdAndUpdate(req.params.id, bed, {});
      res.redirect(`/beds/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
