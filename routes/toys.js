const express = require('express');
const router = express.Router();
const toyController = require('../controllers/toyController');

// Get all toys
router.get('/', toyController.toy_list_get);

module.exports = router;
