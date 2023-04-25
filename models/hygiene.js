const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const HygieneSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: {
    type: String,
    enum: ['Dog', 'Cat', 'Fish', 'Bird', 'Rodent'],
    default: 'Dog',
  },
  name: {
    type: String,
    enum: [
      'Shampoo - 0.5l',
      'Pads - 1pack/50pc',
      'Brush',
      'Water cleaner',
      'Nail clipper',
      'Sawdust - 1pack/5.0l',
      'Cat litter - 1pack/5.0kg',
      'Bird litter - 1pack/2.0kg',
    ],
    default: 'Shampoo - 0.5l',
  },
  description: {
    type: String,
    required: true,
    minLength: [10, 'Description must be minimum 10 characters long.'],
    maxLength: [
      200,
      'Description too long, must be less than or equal 200 characters long.',
    ],
  },
  price: {
    type: mongoose.Decimal128,
    required: true,
    min: [0.01, 'Price must be greater than $0.00'],
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item in the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

HygieneSchema.virtual('category').get(() => 'Hygiene products');

HygieneSchema.virtual('url').get(function () {
  return `/hygiene/${this._id}`;
});

HygieneSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Hygiene', HygieneSchema);
