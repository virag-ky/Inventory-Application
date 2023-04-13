const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const LeashSchema = new mongoose.Schema({
  pet: 'dog',
  name: 'leash',
  description: {
    type: String,
    required: true,
    minLength: [10, 'Name must be minimum 10 characters long.'],
    maxLength: [
      50,
      'Name is too long, must be less than or equal 50 characters.',
    ],
  },
  color: {
    type: String,
    required: true,
    enum: ['black', 'pink', 'red', 'blue'],
    default: 'black',
  },
  price: {
    type: mongoose.Decimal128,
    required: true,
    min: [1.0, 'Price must be greater than 0.0'],
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item to the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

LeashSchema.virtual('category').get(() => 'leashes');

LeashSchema.virtual('url').get(function () {
  return `/home/leashes/${this._id}`;
});
e;

LeashSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Leash', LeashSchema);
