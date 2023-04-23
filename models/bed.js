const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const BedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: { type: String, enum: ['Dog', 'Cat'], default: 'Dog' },
  name: {
    type: String,
    required: true,
    minLength: [3, 'Name must be minimum 3 characters long.'],
    maxLength: [
      25,
      'Name is too long, must be less than or equal 25 characters.',
    ],
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
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    default: 'Small',
  },
  color: {
    type: String,
    enum: ['White', 'Black', 'Brown', 'Beige', 'Pink', 'Blue'],
    default: 'White',
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
  return `/beds/${this._id}`;
});

BedSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Bed', BedSchema);
