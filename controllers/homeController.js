const User = require('../models/user');
const Bag = require('../models/bag');

// Home page
exports.index = async (req, res) => {
  try {
    let bagCount;
    let sumOfItems;
    if (req.user) {
      const currentUser = await User.findById(req.user._id).populate('bags');
      bagCount = currentUser.bags.reduce(
        (acc, bag) => acc + bag.number_in_stock,
        0
      );
      sumOfItems = bagCount;
    }
    res.render('index', {
      title: 'Pet Shop Inventory',
      user: req.user,
      bagCount,
      sumOfItems,
    });
  } catch (err) {
    next(err);
  }
};

// Get user's items
exports.items_get = async (req, res, next) => {
  try {
    const bags = await Bag.find({ user: req.user._id });
    res.render('items', { title: 'Your items:', bags, user: req.user });
  } catch (err) {
    next(err);
  }
};
