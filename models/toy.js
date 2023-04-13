const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const ToySchema = new mongoose.Schema({
  pet: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'rodent', 'bird'],
    default: 'dog',
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        if (
          (this.pet === 'bird' && val !== 'hanging rope') ||
          (this.pet === 'bird' && val !== 'branch')
        ) {
          return false;
        }
        if (
          (this.pet === 'rodent' && val !== 'running wheel') ||
          (this.pet === 'rodent' && val !== 'branch')
        ) {
          return false;
        }
        if (
          (this.pet === 'cat' && val !== 'ball') ||
          (this.pet === 'cat' && val !== 'plush toy')
        ) {
          return false;
        }
        if (
          (this.pet === 'dog' && val !== 'ball') ||
          (this.pet === 'dog' && val !== 'plush toy') ||
          (this.pet === 'dog' && val !== 'chew toy')
        ) {
          return false;
        }
        return true;
      },
      message: 'Invalid toy for pet.',
    },
    enum: [
      'chew toy',
      'ball',
      'plush toy',
      'running wheel',
      'plastic tunnel',
      'hanging rope',
      'branch',
    ],
    default: 'chew toy',
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

ToySchema.virtual('category').get(() => 'toys');

ToySchema.virtual('url').get(function () {
  return `/home/toys/${this._id}`;
});

ToySchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Toy', ToySchema);
