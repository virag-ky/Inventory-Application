const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const ScratchingPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: { type: String, default: 'cat' },
  name: { type: String, default: 'scratching post' },
  description: {
    type: String,
    required: true,
    minLength: [10, 'Description must be minimum 10 characters long.'],
    maxLength: [
      50,
      'Description is too long, must be less than or equal 50 characters.',
    ],
  },
  color: {
    type: String,
    enum: ['white', 'brown', 'beige', 'black'],
    default: 'white',
  },
  price: {
    type: mongoose.Decimal128,
    required: true,
    min: [0.01, 'Price must be greater than $0.00'],
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item to the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

ScratchingPostSchema.virtual('category').get(() => 'scratching posts');

ScratchingPostSchema.virtual('url').get(function () {
  return `/home/scrathingposts/${this._id}`;
});

ScratchingPostSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('ScratchingPost', ScratchingPostSchema);
