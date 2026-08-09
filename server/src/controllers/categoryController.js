import asyncHandler from 'express-async-handler';
import { Category } from '../models/categoryModel.js';
import { Product } from '../models/productModel.js';
import { slugify } from '../utils/slug.js';

export const getCategories = asyncHandler(async (_, response) => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
  response.json({ categories });
});

export const getCategoryBySlug = asyncHandler(async (request, response) => {
  const category = await Category.findOne({ slug: request.params.slug, isActive: true });
  if (!category) {
    response.status(404);
    throw new Error('Category not found');
  }

  const products = await Product.find({ category: category._id, isActive: true }).populate('category');
  response.json({ category, products });
});

export const createCategory = asyncHandler(async (request, response) => {
  const { name, description, image, subcategories } = request.body;
  const category = await Category.create({
    name,
    slug: slugify(name),
    description,
    image,
    subcategories: Array.isArray(subcategories) ? subcategories : [],
  });

  response.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (request, response) => {
  const category = await Category.findById(request.params.id);
  if (!category) {
    response.status(404);
    throw new Error('Category not found');
  }

  category.name = request.body.name ?? category.name;
  category.slug = request.body.name ? slugify(request.body.name) : category.slug;
  category.description = request.body.description ?? category.description;
  category.image = request.body.image ?? category.image;
  category.subcategories = request.body.subcategories ?? category.subcategories;
  category.isActive = request.body.isActive ?? category.isActive;

  await category.save();
  response.json({ category });
});

export const deleteCategory = asyncHandler(async (request, response) => {
  const category = await Category.findByIdAndDelete(request.params.id);
  if (!category) {
    response.status(404);
    throw new Error('Category not found');
  }

  response.json({ message: 'Category deleted successfully' });
});
