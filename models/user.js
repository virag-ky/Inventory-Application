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
  bags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bag' }],
  beds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bed' }],
  clothing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' }],
  hygiene: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hygiene' }],
  food: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  leashes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leash' }],
  toys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Toy' }],
  scratching_posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'ScratchingPost' },
  ],
});

module.exports = mongoose.model('User', UserSchema);
