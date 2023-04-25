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

module.exports = router;
