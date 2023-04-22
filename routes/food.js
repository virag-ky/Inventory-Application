const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Get all food
router.get('/', foodController.food_list_get);

module.exports = router;
