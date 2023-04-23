const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const ScratchingPost = require('../models/scratching_post');

// Get all scratching posts
exports.scratching_post_list_get = async (req, res, next) => {
  try {
    const listOfScratchingPosts = await ScratchingPost.find().sort({
      date_added: -1,
    });
    res.render('scratching-posts/scratching_post_list', {
      title: 'All scratching posts',
      user: req.user,
      list: listOfScratchingPosts,
    });
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
