const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Get all food
router.get('/', foodController.food_list_get);

// Display food form
router.get('/create', foodController.food_create_get);

// Create new food
router.post('/create', foodController.food_create_post);

// Get food details
router.get('/:id', foodController.food_details_get);

module.exports = router;
