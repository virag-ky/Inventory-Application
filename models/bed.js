const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const BedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, 'Name must be minimum 3 characters long.'],
    maxLength: [
      15,
      'Name is too long, must be less than or equal 15 characters.',
    ],
  },
  description: {
    type: String,
    required: true,
    minLength: [10, 'Description must be minimum 10 characters long.'],
    maxLength: [
      50,
      'Description is too long, must be less than or equal 50 characters.',
    ],
  },
  price: {
    type: mongoose.Decimal128,
    required: true,
    min: [1.0, 'Price must be greater than 0.0'],
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large'],
    default: 'small',
  },
  color: {
    type: String,
    required: true,
    enum: ['white', 'black', 'brown', 'beige', 'pink', 'blue'],
    default: 'white',
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item in the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

BedSchema.virtual('category').get(() => 'beds');

BedSchema.virtual('url').get(function () {
  return `/home/beds/${this._id}`;
});

BedSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Bed', BedSchema);
