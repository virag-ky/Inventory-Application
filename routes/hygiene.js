const express = require('express');
const router = express.Router();
const hygieneController = require('../controllers/hygieneController');

// Get all hygiene products
router.get('/', hygieneController.hygiene_list_get);

module.exports = router;
