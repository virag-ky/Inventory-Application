const express = require('express');
const router = express.Router();
const leashController = require('../controllers/leashController');

// Get all leashes
router.get('/', leashController.leash_list_get);

module.exports = router;
