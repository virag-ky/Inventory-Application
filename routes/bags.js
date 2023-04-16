const express = require('express');
const router = express.Router();
const bagController = require('../controllers/bagController');

router.get('/bags', bagController.bag_list_get);

router.get('/bags/create', bagController.bag_create_get);

router.post('/bags/create', bagController.bag_create_post);

module.exports = router;
