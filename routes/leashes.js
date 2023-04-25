const express = require('express');
const router = express.Router();
const leashController = require('../controllers/leashController');

// Get all leashes
router.get('/', leashController.leash_list_get);

// Display leash form
router.get('/create', leashController.leash_create_get);

// Create new leashes
router.post('/create', leashController.leash_create_post);

// Get leash details
router.get('/:id', leashController.leash_details_get);

// Delete the leash
router.post('/:id', leashController.leash_delete);

// Display the update form
router.get('/update/:id', leashController.leash_update_get);

// Update the leash
router.post('/update:id', leashController.leash_update_post);

module.exports = router;
