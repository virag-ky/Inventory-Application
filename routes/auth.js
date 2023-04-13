const express = require('express');
const router = express.Router();
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
