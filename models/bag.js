const mongoose = require('mongoose');
const { DateTime } = require(luxon);

const BagSchema = new mongoose.Schema({
  pet: { type: String, required: true, enum: ['dog', 'cat'], default: 'dog' },
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
    min: [0.01, 'Price must be greater than $0.00'],
  },
  bag_type: {
    type: String,
    required: true,
    enum: ['handbag', 'carrier', 'shoulder-bag', 'backpack'],
    default: 'handbag',
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
    enum: ['white', 'black', 'brown', 'beige'],
    default: 'white',
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item in the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

BagSchema.virtual('category').get(() => 'bags/carriers');

BagSchema.virtual('url').get(function () {
  return `/home/bags-carriers/${this._id}`;
});

BagSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Bag', BagSchema);
