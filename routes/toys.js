const express = require('express');
const router = express.Router();
const toyController = require('../controllers/toyController');

// Get all toys
router.get('/', toyController.toy_list_get);

// Display toy form
router.get('/create', toyController.toy_create_get);

// Create new toys
router.post('/create', toyController.toy_create_post);

// Get toy details
router.get('/:id', toyController.toy_details_get);

// Delete the toy
router.post('/:id', toyController.toy_delete);

module.exports = router;
