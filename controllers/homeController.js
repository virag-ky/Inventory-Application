const User = require('../models/user');
const Bag = require('../models/bag');
const Bed = require('../models/bed');
const Clothing = require('../models/clothing');
const Food = require('../models/food');
const Hygiene = require('../models/hygiene');
const Leash = require('../models/leash');
const Toy = require('../models/toy');
const ScratchingPost = require('../models/scratching_post');

// Get sum of items helper function
const getSumOfItems = (array) =>
  array.reduce((acc, obj) => acc + obj.number_in_stock, 0);

// Get the items count helper function
const getItemsCount = async (req) => {
  const currentUser = await User.findById(req.user._id)
    .populate('bags')
    .populate('beds')
    .populate('clothes')
    .populate('hygiene')
    .populate('leashes')
    .populate('toys')
    .populate('food')
    .populate('scratching_posts');
  const bagCount = getSumOfItems(currentUser.bags);
  const bedCount = getSumOfItems(currentUser.beds);
  const foodCount = getSumOfItems(currentUser.food);
  const clothingCount = getSumOfItems(currentUser.clothes);
  const hygieneCount = getSumOfItems(currentUser.hygiene);
  const leashCount = getSumOfItems(currentUser.leashes);
  const toyCount = getSumOfItems(currentUser.toys);
  const scratchingPostCount = getSumOfItems(currentUser.scratching_posts);
  const sumOfItems =
    bagCount +
    bedCount +
    toyCount +
    leashCount +
    hygieneCount +
    clothingCount +
    foodCount +
    scratchingPostCount;
  return {
    sumOfItems,
    bagCount,
    bedCount,
    clothingCount,
    toyCount,
    scratchingPostCount,
    leashCount,
    hygieneCount,
    foodCount,
  };
};

// Home page
exports.index = async (req, res, next) => {
  try {
    const user = req.user;
    if (user) {
      const {
        sumOfItems,
        bagCount,
        bedCount,
        clothingCount,
        toyCount,
        scratchingPostCount,
        leashCount,
        hygieneCount,
        foodCount,
      } = await getItemsCount(req);
      console.log(req.originalUrl);
      res.render('index', {
        title: 'Pet Shop Inventory',
        user,
        bagCount,
        bedCount,
        clothingCount,
        toyCount,
        scratchingPostCount,
        leashCount,
        hygieneCount,
        foodCount,
        sumOfItems,
        req,
      });
    } else {
      res.render('index', {
        title: 'Pet Shop Inventory',
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get user's items
exports.items_get = async (req, res, next) => {
  try {
    const user = req.user;
    if (user) {
      const {
        sumOfItems,
        bagCount,
        bedCount,
        clothingCount,
        toyCount,
        scratchingPostCount,
        leashCount,
        hygieneCount,
        foodCount,
      } = await getItemsCount(req);
      const bags = await Bag.find({ user: user._id });
      const beds = await Bed.find({ user: user._id });
      const clothes = await Clothing.find({ user: user._id });
      const hygiene = await Hygiene.find({ user: user._id });
      const food = await Food.find({ user: user._id });
      const leashes = await Leash.find({ user: user._id });
      const toys = await Toy.find({ user: user._id });
      const scratching_posts = await ScratchingPost.find({ user: user._id });
      res.render('items', {
        title: 'Your items:',
        bags,
        beds,
        clothes,
        hygiene,
        leashes,
        food,
        scratching_posts,
        toys,
        user,
        bagCount,
        bedCount,
        clothingCount,
        toyCount,
        scratchingPostCount,
        leashCount,
        hygieneCount,
        foodCount,
        sumOfItems,
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
};
