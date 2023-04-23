const express = require('express');
const router = express.Router();
const hygieneController = require('../controllers/hygieneController');

// Get all hygiene products
router.get('/', hygieneController.hygiene_list_get);

// Display hygiene form
router.get('/create', hygieneController.hygiene_create_get);

module.exports = router;
