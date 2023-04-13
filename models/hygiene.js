const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const HygieneStuffSchema = new mongoose.Schema({
  pet: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'fish', 'bird', 'rodent'],
    default: 'dog',
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        if (this.pet === 'fish' && val !== 'water cleaner') {
          return false;
        }
        if (
          (this.pet === 'bird' && val !== 'nail clipper') ||
          (this.pet === 'bird' && val !== 'bird litter - 1pack/2.0kg')
        ) {
          return false;
        }
        if (
          (this.pet === 'rodent' && val !== 'nail clipper') ||
          (this.pet === 'rodent' && val !== 'sawdust - 1pack/5.0l')
        ) {
          return false;
        }
        if (
          (this.pet === 'cat' && val !== 'shampoo') ||
          (this.pet === 'cat' && val !== 'brush') ||
          (this.pet === 'cat' && val !== 'cat litter - 1pack/5.0kg') ||
          (this.pet === 'cat' && val !== 'nail clipper')
        ) {
          return false;
        }
        if (
          (this.pet === 'dog' && val !== 'shampoo') ||
          (this.pet === 'dog' && val !== 'brush') ||
          (this.pet === 'dog' && val !== 'nail clipper') ||
          (this.pet === 'dog' && val !== 'pads - 1pack/50pc')
        ) {
          return false;
        }
        return true;
      },
      message: 'Invalid hygiene product for pet.',
    },
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
    default: 'shampoo',
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

HygieneSchema.virtual('category').get(() => 'hygiene products');

HygieneSchema.virtual('url').get(function () {
  return `/home/hygiene/${this._id}`;
});

HygieneSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('HygieneStuff', HygieneStuffSchema);
