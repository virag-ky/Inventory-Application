const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

// Display create new user form
router.get('/new-user', user_controller.user_create_get);

// Display login form
router.get('/login', user_controller.user_login_get);

// Login
router.post('/login/password', user_controller.user_login_post);

module.exports = router;
