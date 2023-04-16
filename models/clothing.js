const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const ClothingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: { type: String, enum: ['dog', 'cat'], default: 'dog' },
  name: {
    type: String,
    required: true,
    minLength: [3, 'Name must be minimum 3 characters long.'],
    maxLength: [
      20,
      'Name is too long, must be less than or equal 20 characters.',
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
  clothing_type: {
    type: String,
    enum: ['sweater', 'jacket', 'overall', 'vest'],
    default: 'sweater',
  },
  color: {
    type: String,
    enum: ['white', 'black', 'brown', 'yellow', 'red', 'pink', 'blue'],
    default: 'white',
  },
  size: {
    type: String,
    enum: ['extra-small', 'small', 'medium', 'large'],
    default: 'small',
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item in the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

ClothingSchema.virtual('category').get(() => 'clothing');

ClothingSchema.virtual('url').get(function () {
  return `/home/clothing/${this._id}`;
});

ClothingSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Clothing', ClothingSchema);
