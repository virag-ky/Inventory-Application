const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const ScratchingPost = require('../models/scratching_post');

// Get all scratching posts
exports.scratching_post_list_get = async (req, res, next) => {
  try {
    if (req.user) {
      const listOfScratchingPosts = await ScratchingPost.find().sort({
        date_added: -1,
      });
      res.render('scratching-posts/scratching_post_list', {
        title: 'All scratching posts',
        user: req.user,
        list: listOfScratchingPosts,
      });
      return;
    }
    res.redirect('/login/?message=Session%20expired.');
  } catch (err) {
    next(err);
  }
};

// Display scratching post form
exports.scratching_post_create_get = (req, res) => {
  if (!req.user) {
    res.redirect('/login/?message=Session%20expired.');
  } else {
    res.render('scratching-posts/scratching_post_form', {
      title: 'Add new scratching posts',
      user: req.user,
    });
  }
};

// Create new scratching posts
exports.scratching_post_create_post = [
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
      const post = new ScratchingPost({
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
        user: req.user._id,
      });
      if (!errors.isEmpty()) {
        res.render('scratching-posts/scratching_post_form', {
          title: 'Add new scratching posts',
          user: req.user,
          scratching_post: post,
          errors: errors.array(),
        });
      } else {
        await post.save();
        const user = await User.findById(req.user._id).populate(
          'scratching_posts'
        );
        user.scratching_posts.push(post);
        await user.save();
        res.redirect(post.url);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Get scratching post details
exports.scratching_post_details_get = async (req, res, next) => {
  try {
    const post = await ScratchingPost.findById(req.params.id).populate('user');
    if (post) {
      if (req.user) {
        res.render('scratching-posts/scratching_post_details', {
          title: 'Details of the scratching post:',
          scratching_post: post,
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

// Delete the scratching post
exports.scratching_post_delete = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
      return;
    }
    await ScratchingPost.findByIdAndRemove(req.body.id);
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { scratching_post: req.body.id } }
    );
    res.redirect('/scratching-posts');
  } catch (err) {
    next(err);
  }
};

// Display the scratching post update form
exports.scratching_post_update_get = async (req, res, next) => {
  try {
    const post = await ScratchingPost.findById(req.params.id);
    if (!req.user) {
      res.redirect('/login/?message=Session%20expired.');
    } else {
      res.render('scratching-posts/scratching_post_form', {
        title: 'Update scratching post',
        scratching_post: post,
        user: req.user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update the scratching post
exports.scratching_post_update_post = [
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
      const post = {
        pet: req.body.pet,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.quantity,
        color: req.body.color,
      };
      if (!errors.isEmpty()) {
        res.render('scratching-posts/scratching_post_form', {
          title: 'Update scratching post',
          scratching_post: post,
          errors: errors.array(),
          user: req.user,
        });
        return;
      }
      await ScratchingPost.findByIdAndUpdate(req.params.id, post, {});
      res.redirect(`/scratching-posts/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },
];
