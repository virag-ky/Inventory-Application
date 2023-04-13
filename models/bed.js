const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const BedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: mongoose.Decimal128, required: true },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large'],
    default: 'small',
  },
  color: {
    type: String,
    required: true,
    enum: ['white', 'black', 'brown', 'beige', 'pink', 'blue'],
    default: 'white',
  },
  date_added: { type: Date, default: Date.now },
});

BedSchema.virtual('category').get(() => 'beds');

BedSchema.virtual('url').get(function () {
  return `/home/beds/${this._id}`;
});

BedSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Bed', BedSchema);
