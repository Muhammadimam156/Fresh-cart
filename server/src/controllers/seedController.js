import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { Category } from '../models/categoryModel.js';
import { Product } from '../models/productModel.js';
import { Setting } from '../models/settingModel.js';

export const runSeed = asyncHandler(async (request, response) => {
  if (process.env.NODE_ENV === 'production') {
    response.status(403);
    throw new Error('Seeding not allowed in production');
  }

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Setting.deleteMany({})]);

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

  const hashed = await bcrypt.hash('Admin@123', 12);
  const admin = await User.create({ name: 'Store Admin', email: 'admin@freshcart.test', phone: '', password: hashed, role: 'admin' });

  await Setting.create({ contactNumber: '', whatsappNumber: '', address: '' });

  response.json({ message: 'Seed completed', admin: { email: admin.email, password: 'Admin@123' } });
});
