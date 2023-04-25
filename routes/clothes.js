const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');

// Get all clothes
router.get('/', clothingController.clothing_list_get);

// Display the clothing form
router.get('/create', clothingController.clothing_create_get);

// Create new clothes
router.post('/create', clothingController.clothing_create_post);

// Get clothing details
router.get('/:id', clothingController.clothing_details_get);

// Delete the clothing
router.post('/:id', clothingController.clothing_delete);

// Display the update form
router.get('/update/:id', clothingController.clothing_update_get);

// Update the clothing
router.post('/update:id', clothingController.clothing_update_post);

module.exports = router;
