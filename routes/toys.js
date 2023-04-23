const express = require('express');
const router = express.Router();
const toyController = require('../controllers/toyController');

// Get all toys
router.get('/', toyController.toy_list_get);

// Display toy form
router.get('/create', toyController.toy_create_get);

module.exports = router;
