const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Get home page
router.get('/', homeController.index);

// Get user's items
router.get('/items', homeController.items_get);

module.exports = router;
