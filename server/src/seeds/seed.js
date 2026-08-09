import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { Category } from '../models/categoryModel.js';
import { Product } from '../models/productModel.js';
import { Coupon } from '../models/couponModel.js';
import { Setting } from '../models/settingModel.js';

dotenv.config();

async function seed() {
  const mongo = process.env.MONGO_URI;
  if (!mongo) {
    console.error('MONGO_URI is not set. Aborting seed.');
    process.exit(1);
  }

  await mongoose.connect(mongo);
  console.log('Connected to MongoDB for seeding');

  // Clean collections
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Setting.deleteMany({}),
  ]);

  // Create categories
  const categoryDocs = await Category.create([
    { name: 'Salt', slug: 'salt' },
    { name: 'Flour', slug: 'flour' },
    { name: 'Rice', slug: 'rice' },
    { name: 'Sugar', slug: 'sugar' },
    { name: 'Oil', slug: 'oil' },
    { name: 'Tea', slug: 'tea' },
    { name: 'Spices', slug: 'spices' },
  ]);

  const catMap = Object.fromEntries(categoryDocs.map((c) => [c.slug, c._id]));

  // Create products (minimal)
  await Product.create([
    {
      name: 'Whole Wheat Flour',
      slug: 'whole-wheat-flour',
      category: catMap['flour'],
      description: 'Stone-ground wheat flour with balanced taste.',
      price: 420,
      stock: 40,
      images: [],
      featured: true,
      latest: true,
    },
    {
      name: 'Basmati Rice',
      slug: 'basmati-rice',
      category: catMap['rice'],
      description: 'Premium long-grain basmati rice.',
      price: 980,
      stock: 34,
      images: [],
      featured: true,
      latest: false,
    },
  ]);

  // Create admin user
  const hashed = await bcrypt.hash('Admin@123', 12);
  await User.create({ name: 'Store Admin', email: 'admin@freshcart.test', phone: '', password: hashed, role: 'admin' });

  // Create default settings
  await Setting.create({ contactNumber: '', whatsappNumber: '', address: '' });

  // Create sample coupon
  await Coupon.create({ code: 'WELCOME10', type: 'percent', amount: 10, maxUses: 0 });

  console.log('Database seeded successfully. Admin: admin@freshcart.test / Admin@123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
