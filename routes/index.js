const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { new_user: req.query.newUser, user: req.user });
});

module.exports = router;
