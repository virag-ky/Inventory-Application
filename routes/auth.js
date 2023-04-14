const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

// Display create new user form
router.get('/new-user', user_controller.user_create_get);

// Create new user
router.post('/new-user', user_controller.user_create_post);

// Display login form
router.get('/login', user_controller.user_login_get);

// Login
router.post('/login', user_controller.user_login_post);

// Logout
router.get('/log-out', user_controller.user_logout_get);

module.exports = router;
