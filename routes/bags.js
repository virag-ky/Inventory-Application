const express = require('express');
const router = express.Router();
const bagController = require('../controllers/bagController');

router.get('/bags', bagController.bag_list_get);

module.exports = router;
