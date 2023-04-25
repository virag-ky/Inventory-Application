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

// Delete the food
router.post('/:id', foodController.food_delete);

// Display the update form
router.get('/update/:id', foodController.food_update_get);

// Update the food
router.post('/update:id', foodController.food_update_post);

module.exports = router;
