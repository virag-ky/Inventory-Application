const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [2, 'Username must be minimum 2 characters long.'],
    maxLength: [
      15,
      'Username is too long, must be less than or equal 15 characters.',
    ],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password must be at least 8 characters long.'],
  },
});

module.exports = mongoose.model('User', UserSchema);
