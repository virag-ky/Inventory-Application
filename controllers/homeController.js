const Bag = require('../models/bag');
const Bed = require('../models/bed');
const Clothing = require('../models/clothing');
const Food = require('../models/food');
const HygieneStuff = require('../models/hygiene');
const Leash = require('../models/leash');
const ScratchingPost = require('../models/scratching_post');
const Toy = require('../models/toy');

exports.index = async (req, res) => {
  try {
    const [
      bag_count,
      bed_count,
      clothing_count,
      food_count,
      hygienestuff_count,
      leash_count,
      toy_count,
      scratchingpost_count,
    ] = await Promise.all([
      Bag.countDocuments(),
      Bed.countDocuments(),
      Clothing.countDocuments(),
      Food.countDocuments(),
      HygieneStuff.countDocuments(),
      Leash.countDocuments(),
      Toy.countDocuments(),
      ScratchingPost.countDocuments(),
    ]);
    res.render('index', {
      title: 'Pet Shop Inventory',
      data: {
        bag_count,
        bed_count,
        clothing_count,
        food_count,
        hygienestuff_count,
        leash_count,
        toy_count,
        scratchingpost_count,
      },
      user: req.user,
      greeting: req.query.greeting,
    });
  } catch (err) {
    res.render('index', { title: 'Pet Shop Inventory', error: err, data: {} });
  }
};
