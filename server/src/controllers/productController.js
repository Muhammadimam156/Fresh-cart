import asyncHandler from 'express-async-handler';
import { Product } from '../models/productModel.js';
import { Category } from '../models/categoryModel.js';
import { slugify } from '../utils/slug.js';

function parseBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
}

export const getProducts = asyncHandler(async (request, response) => {
  const { search = '', category = '', featured = '', latest = '' } = request.query;
  const filter = { isActive: true };

  if (category) {
    const categoryDocument = await Category.findOne({ slug: category });
    if (categoryDocument) {
      filter.category = categoryDocument._id;
    }
  }

  if (featured) {
    filter.featured = featured === 'true';
  }

  if (latest) {
    filter.latest = latest === 'true';
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  response.json({ products });
});

export const getProductBySlug = asyncHandler(async (request, response) => {
  const product = await Product.findOne({ slug: request.params.slug, isActive: true }).populate('category');
  if (!product) {
    response.status(404);
    throw new Error('Product not found');
  }

  response.json({ product });
});

export const createProduct = asyncHandler(async (request, response) => {
  const { name, category, subcategory, description, price, stock, images, featured, latest } = request.body;
  const product = await Product.create({
    name,
    slug: slugify(name),
    category,
    subcategory,
    description,
    price,
    stock,
    images: Array.isArray(images) ? images : [],
    featured: parseBoolean(featured),
    latest: parseBoolean(latest),
  });

  response.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (request, response) => {
  const product = await Product.findById(request.params.id);
  if (!product) {
    response.status(404);
    throw new Error('Product not found');
  }

  product.name = request.body.name ?? product.name;
  product.slug = request.body.name ? slugify(request.body.name) : product.slug;
  product.category = request.body.category ?? product.category;
  product.subcategory = request.body.subcategory ?? product.subcategory;
  product.description = request.body.description ?? product.description;
  product.price = request.body.price ?? product.price;
  product.stock = request.body.stock ?? product.stock;
  product.images = request.body.images ?? product.images;
  product.featured = request.body.featured !== undefined ? parseBoolean(request.body.featured) : product.featured;
  product.latest = request.body.latest !== undefined ? parseBoolean(request.body.latest) : product.latest;
  product.isActive = request.body.isActive ?? product.isActive;

  await product.save();
  response.json({ product });
});

export const deleteProduct = asyncHandler(async (request, response) => {
  const product = await Product.findByIdAndDelete(request.params.id);
  if (!product) {
    response.status(404);
    throw new Error('Product not found');
  }

  response.json({ message: 'Product deleted successfully' });
});

export const getFeaturedProducts = asyncHandler(async (_, response) => {
  const products = await Product.find({ featured: true, isActive: true }).populate('category').sort({ createdAt: -1 }).limit(12);
  response.json({ products });
});

export const getLatestProducts = asyncHandler(async (_, response) => {
  const products = await Product.find({ latest: true, isActive: true }).populate('category').sort({ createdAt: -1 }).limit(12);
  response.json({ products });
});
