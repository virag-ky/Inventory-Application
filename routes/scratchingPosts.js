const express = require('express');
const router = express.Router();
const scratchingPostController = require('../controllers/scratchingPostController');

// Get all scratching posts
router.get('/', scratchingPostController.scratching_post_list_get);

// Display scratching post form
router.get('/create', scratchingPostController.scratching_post_create_get);

module.exports = router;
