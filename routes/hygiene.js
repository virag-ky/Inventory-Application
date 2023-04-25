const express = require('express');
const router = express.Router();
const hygieneController = require('../controllers/hygieneController');

// Get all hygiene products
router.get('/', hygieneController.hygiene_list_get);

// Display hygiene form
router.get('/create', hygieneController.hygiene_create_get);

// Create new hygiene products
router.post('/create', hygieneController.hygiene_create_post);

// Get hygiene product details
router.get('/:id', hygieneController.hygiene_details_get);

// Delete the hygiene product
router.post('/:id', hygieneController.hygiene_delete);

// Display the update form
router.get('/update/:id', hygieneController.hygiene_update_get);

// Update the hygiene product
router.post('/update:id', hygieneController.hygiene_update_post);

module.exports = router;
