const express = require('express');
const router = express.Router();
const bagController = require('../controllers/bagController');

// Get all bags
router.get('/', bagController.bag_list_get);

// Display the create bag form
router.get('/create', bagController.bag_create_get);

// Create new bags
router.post('/create', bagController.bag_create_post);

// Get the bag's details
router.get('/:id', bagController.bag_details_get);

// Delete the bag
router.post('/:id', bagController.bag_delete);

// Display the bag update form
router.get('/update/:id', bagController.bag_update_get);

// Update the bag
router.post('/update/:id', bagController.bag_update_post);

module.exports = router;
