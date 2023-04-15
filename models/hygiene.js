const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const HygieneStuffSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  pet: {
    type: String,
    enum: ['dog', 'cat', 'fish', 'bird', 'rodent'],
    default: 'dog',
  },
  name: {
    type: String,
    enum: [
      'shampoo - 0.5l',
      'pads - 1pack/50pc',
      'brush',
      'water cleaner',
      'nail clipper',
      'sawdust - 1pack/5.0l',
      'cat litter - 1pack/5.0kg',
      'bird litter - 1pack/2.0kg',
    ],
    default: 'shampoo - 0.5l',
  },
  description: {
    type: String,
    required: true,
    minLength: [10, 'Description must be minimum 10 characters long.'],
    maxLength: [
      50,
      'Description too long, must be less than or equal 50 characters long.',
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

HygieneStuffSchema.virtual('category').get(() => 'hygiene products');

HygieneStuffSchema.virtual('url').get(function () {
  return `/home/hygiene/${this._id}`;
});

HygieneStuffSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('HygieneStuff', HygieneStuffSchema);
