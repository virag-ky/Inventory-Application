const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');

// Get all beds
router.get('/', bedController.beds_list_get);

// Display the bed form
router.get('/create', bedController.bed_create_get);

module.exports = router;
