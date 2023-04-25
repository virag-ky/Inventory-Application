const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const FoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pet: {
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rodent'],
    default: 'Dog',
  },
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
  food_type: {
    type: String,
    enum: [
      'Dry',
      'Canned',
      'Wet-packet',
      'Fish flakes',
      'Fish pellets',
      'Seed mix',
    ],
    default: 'Dry',
  },
  flavor: {
    type: String,
    enum: ['Chicken', 'Beef', 'Pork', 'Fish', 'Veggie', 'Seed'],
    default: 'Chicken',
  },
  price: {
    type: mongoose.Decimal128,
    required: true,
    min: [0.01, 'Price must be greater then $0.00'],
  },
  weight: {
    type: String,
    enum: ['0.5', '1.0', '1.2', '1.5', '2.0', '2.5', '3.0', '5.0'],
    default: '0.5',
  },
  number_in_stock: {
    type: Number,
    required: true,
    min: [1, 'You must add at least 1 item to the stock.'],
  },
  date_added: { type: Date, default: Date.now },
});

FoodSchema.virtual('category').get(() => 'Food');

FoodSchema.virtual('url').get(function () {
  return `/food/${this._id}`;
});

FoodSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Food', FoodSchema);
