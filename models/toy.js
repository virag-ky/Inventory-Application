const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const ToySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: {
    type: String,
    enum: ['Dog', 'Cat', 'Rodent', 'Bird'],
    default: 'Dog',
  },
  name: {
    type: String,
    enum: [
      'Chew toy',
      'Ball',
      'Plush toy',
      'Running wheel',
      'Plastic tunnel',
      'Hanging rope',
      'Branch',
    ],
    default: 'Chew toy',
  },
  description: {
    type: String,
    required: true,
    minLength: [10, 'Description must be minimum 10 characters long.'],
    maxLength: [
      200,
      'Description is too long, must be less than or equal 200 characters.',
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
    min: [1, 'You must add at least 1 item to the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

ToySchema.virtual('category').get(() => 'Toys');

ToySchema.virtual('url').get(function () {
  return `/toys/${this._id}`;
});

ToySchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Toy', ToySchema);
