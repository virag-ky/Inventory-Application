#! /usr/bin/env node

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

const Bag = require('./models/bag');
const Bed = require('./models/bed');
const Clothing = require('./models/clothing');
const Food = require('./models/food');
const HygieneStuff = require('./models/hygiene');
const Leash = require('./models/leash');
const ScratchingPost = require('./models/scratching_post');
const Toy = require('./models/toy');

const bags = [];
const beds = [];
const foods = [];
const clothings = [];
const hygieneStuffs = [];
const leashes = [];
const scratchingPosts = [];
const toys = [];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected');
  await createBags();
  await createBeds();
  await createFoods();
  await createClothings();
  await createHygieneStuffs();
  await createLeashes();
  await createToys();
  await createScratchingPosts();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function bagCreate(obj) {
  const { name, description, price, number_in_stock } = obj;
  const bag = new Bag({ name, description, price, number_in_stock });
  await bag.save();
  bags.push(bag);
  console.log(`Added bag: ${name}`);
}

async function bedCreate(obj) {
  const { name, description, price, number_in_stock } = obj;
  const bed = new Bed({ name, description, price, number_in_stock });
  await bed.save();
  beds.push(bed);
  console.log(`Added bed: ${name}`);
}

async function foodCreate(obj) {
  const { name, description, price, number_in_stock } = obj;
  const food = new Food({ name, description, price, number_in_stock });
  await food.save();
  foods.push(food);
  console.log(`Added food: ${name}`);
}

async function clothingCreate(obj) {
  const { name, description, price, number_in_stock } = obj;
  const clothing = new Clothing({ name, description, price, number_in_stock });
  await clothing.save();
  clothings.push(clothing);
  console.log(`Added clothing: ${name}`);
}

async function hygieneStuffCreate(obj) {
  const { description, price, number_in_stock } = obj;
  const hygieneStuff = new HygieneStuff({
    description,
    price,
    number_in_stock,
  });
  await hygieneStuff.save();
  hygieneStuffs.push(hygieneStuff);
  console.log(`Added hygiene stuff: ${hygieneStuff.name}`);
}

async function leashCreate(obj) {
  const { description, price, number_in_stock } = obj;
  const leash = new Leash({
    description,
    price,
    number_in_stock,
  });
  await leash.save();
  leashes.push(leash);
  console.log(`Added leash: ${leash.name}`);
}

async function scratchingPostCreate(obj) {
  const { description, price, number_in_stock } = obj;
  const scratchingPost = new ScratchingPost({
    description,
    price,
    number_in_stock,
  });
  await scratchingPost.save();
  scratchingPosts.push(scratchingPost);
  console.log(`Added scratching post: ${scratchingPost.name}`);
}

async function toyCreate(obj) {
  const { description, price, number_in_stock } = obj;
  const toy = new Toy({
    description,
    price,
    number_in_stock,
  });
  await toy.save();
  toys.push(toy);
  console.log(`Added toy: ${toy.name}`);
}

async function createBags() {
  console.log('Adding bags');
  await Promise.all([
    bagCreate({
      name: 'Doggy handbag',
      description: 'A small sized dog handbag.',
      price: 25.0,
      number_in_stock: 5,
    }),
    bagCreate({
      name: 'Puppy handbag',
      description: 'A small sized puppy handbag.',
      price: 20.0,
      number_in_stock: 2,
    }),
    bagCreate({
      name: 'Chihuahua purse',
      description: 'A small sized chihuahua handbag.',
      price: 50.0,
      number_in_stock: 15,
    }),
  ]);
}

async function createBeds() {
  console.log('Adding beds');
  await Promise.all([
    bedCreate({
      name: 'Sleeping Dog Bed',
      description: 'A small sized doggy bed.',
      price: 12.0,
      number_in_stock: 25,
    }),
    bedCreate({
      name: 'Fluff Bed',
      description: 'A small sized puppy bed.',
      price: 18.0,
      number_in_stock: 22,
    }),
    bedCreate({
      name: 'Chihuahua Dreams Bed',
      description: 'A small sized chihuahua bed.',
      price: 35.0,
      number_in_stock: 9,
    }),
  ]);
}

async function createFoods() {
  console.log('Adding foods');
  await Promise.all([
    foodCreate({
      name: 'Chihuahua Happy Meal',
      description: 'A bag of chihuahua dry food.',
      price: 30.0,
      number_in_stock: 99,
    }),
    foodCreate({
      name: 'Puppy Dinner',
      description: 'A bag of puppy meal.',
      price: 15.0,
      number_in_stock: 102,
    }),
    foodCreate({
      name: 'Yummy Yum Dog Food',
      description: 'A small sized chihuahua bed.',
      price: 25.0,
      number_in_stock: 55,
    }),
  ]);
}

async function createClothings() {
  console.log('Adding clothings');
  await Promise.all([
    clothingCreate({
      name: 'Chi-Chi Sweater',
      description: 'A nice and warm Chihuahua sweater.',
      price: 36.0,
      number_in_stock: 20,
    }),
    clothingCreate({
      name: 'Puppy Sweater',
      description: 'A nice and warm puppy sweater.',
      price: 10.0,
      number_in_stock: 3,
    }),
    clothingCreate({
      name: 'Puffy Sweater',
      description: 'A puffy sweater for small sized dogs.',
      price: 18.0,
      number_in_stock: 34,
    }),
  ]);
}

async function createHygieneStuffs() {
  console.log('Adding hygiene stuffs');
  await Promise.all([
    hygieneStuffCreate({
      description: 'A Chihuahua shampoo',
      price: 5.0,
      number_in_stock: 25,
    }),
    hygieneStuffCreate({
      description: 'Puppy shampoo',
      price: 8.0,
      number_in_stock: 37,
    }),
    hygieneStuffCreate({
      description: 'Shampoo for long-haired dogs.',
      price: 22.0,
      number_in_stock: 2,
    }),
  ]);
}

async function createToys() {
  console.log('Adding toys');
  await Promise.all([
    toyCreate({
      description: 'Chihuahua toy.',
      price: 5.0,
      number_in_stock: 2,
    }),
    toyCreate({
      description: 'Puppy chew toy.',
      price: 3.0,
      number_in_stock: 1,
    }),
    toyCreate({
      description: 'Chewing bone for dogs.',
      price: 12.0,
      number_in_stock: 100,
    }),
  ]);
}

async function createLeashes() {
  console.log('Adding leashes');
  await Promise.all([
    leashCreate({
      description: 'A Chihuahua leash',
      price: 5.0,
      number_in_stock: 23,
    }),
    leashCreate({
      description: 'Puppy leash',
      price: 5.0,
      number_in_stock: 37,
    }),
    leashCreate({
      description: 'Leash for dogs.',
      price: 12.0,
      number_in_stock: 10,
    }),
  ]);
}

async function createScratchingPosts() {
  console.log('Adding scratching posts');
  await Promise.all([
    scratchingPostCreate({
      description: 'A cat scratching post',
      price: 35.0,
      number_in_stock: 45,
    }),
    scratchingPostCreate({
      description: 'A cat scratching post',
      price: 30.0,
      number_in_stock: 30,
    }),
    scratchingPostCreate({
      description: 'A cat scratching post',
      price: 45.0,
      number_in_stock: 16,
    }),
  ]);
}
