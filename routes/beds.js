const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');

// Get all beds
router.get('/', bedController.beds_list_get);

// Display the bed form
router.get('/create', bedController.bed_create_get);

// Create new beds
router.post('/create', bedController.bed_create_post);

// Get the bed's details
router.get('/:id', bedController.bed_details_get);

// Delete the bed
router.post('/:id', bedController.bed_delete);

// Display the update form
router.get('/update/:id', bedController.bed_update_get);

// Update the bed
router.post('/update:id', bedController.bed_update_post);

module.exports = router;
