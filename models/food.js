const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const FoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'fish', 'rodent'],
    default: 'dog',
  },
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
  food_type: {
    type: String,
    enum: ['dry', 'canned', 'wet-packet'],
    default: 'dry',
  },
  flavor: {
    type: String,
    enum: ['chicken', 'beef', 'pork', 'fish', 'veggie'],
    default: 'chicken',
  },
  price: {
    type: mongoose.Decimal128,
    required: true,
    min: [0.01, 'Price must be greater then $0.00'],
  },
  food_weight: {
    type: mongoose.Decimal128,
    min: [0.5, 'Food-weight must be minimum 0.5kg'],
    max: [5.0, 'Food-weight must be less than or equal 5.0kg'],
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item to the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

FoodSchema.virtual('category').get(() => 'foods');

FoodSchema.virtual('url').get(function () {
  return `/home/foods/${this._id}`;
});

FoodSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Food', FoodSchema);
