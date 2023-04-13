const mongoose = require('mongoose');
const { DateTime } = require(luxon);

const BagSchema = new mongoose.Schema({
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
    enum: ['white', 'black', 'brown', 'beige'],
    default: 'white',
  },
  date_added: { type: Date, default: Date.now },
});

BagSchema.virtual('category').get(() => 'bags/carriers');

BagSchema.virtual('url').get(function () {
  return `/home/bags_carriers/${this._id}`;
});

BagSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Bag', BagSchema);
