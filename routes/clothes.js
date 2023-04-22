const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');

// Get all clothes
router.get('/', clothingController.clothing_list_get);

// Display the clothing form
router.get('/create', clothingController.clothing_create_get);

module.exports = router;
