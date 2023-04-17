const express = require('express');
const router = express.Router();
const bagController = require('../controllers/bagController');

// Get all bags
router.get('/bags', bagController.bag_list_get);

// Display the bag form
router.get('/bags/create', bagController.bag_create_get);

// Create new bags
router.post('/bags/create', bagController.bag_create_post);

// Get the bag's details
router.get('/bags/:id', bagController.bag_details_get);

// Delete the bag
router.post('/bags/:id', bagController.bag_delete);

// Display the update form
router.get('/bags/update/:id', bagController.bag_update);

module.exports = router;