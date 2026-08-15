import asyncHandler from 'express-async-handler';
import { Product } from '../models/productModel.js';
import { Category } from '../models/categoryModel.js';
import { slugify } from '../utils/slug.js';

function parseBoolean(value, fallback = false) {
  if (value === undefined) return fallback;

  if (typeof value === 'boolean') {
    return value;
  }

  return String(value).toLowerCase() === 'true';
}

function normalizeVariants(variants) {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants
    .map((variant, index) => {
      const weight = Number(variant.weight);
      const price = Number(variant.price);
      const stock = Number(variant.stock ?? 0);

      if (!Number.isFinite(weight) || weight <= 0) {
        return null;
      }

      if (!Number.isFinite(price) || price < 0) {
        return null;
      }

      return {
        id: String(
          variant.id ||
            `${Date.now()}-${index}-${weight}`
        ),

        label:
          variant.label ||
          `${weight} ${variant.unit || 'kg'}`,

        weight,

        unit: variant.unit || 'kg',

        price,

        stock: Math.max(
          0,
          Number.isFinite(stock) ? stock : 0
        ),
      };
    })
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

export const getProducts = asyncHandler(
  async (request, response) => {
    const {
      search = '',
      category = '',
      featured = '',
      latest = '',
    } = request.query;

    const filter = {
      isActive: true,
    };

    if (category) {
      const categoryDocument = await Category.findOne({
        $or: [
          { slug: category },
          {
            name: {
              $regex: `^${category}$`,
              $options: 'i',
            },
          },
        ],
      });

      if (categoryDocument) {
        filter.category = categoryDocument._id;
      }
    }

    if (featured !== '') {
      filter.featured = featured === 'true';
    }

    if (latest !== '') {
      filter.latest = latest === 'true';
    }

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          subcategory: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const products = await Product.find(filter)
      .populate('category')
      .sort({ createdAt: -1 });

    response.json({
      products,
    });
  }
);

/*
|--------------------------------------------------------------------------
| GET PRODUCT BY SLUG
|--------------------------------------------------------------------------
*/

export const getProductBySlug = asyncHandler(
  async (request, response) => {
    const product = await Product.findOne({
      slug: request.params.slug,
      isActive: true,
    }).populate('category');

    if (!product) {
      response.status(404);
      throw new Error('Product not found');
    }

    response.json({
      product,
    });
  }
);

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

export const createProduct = asyncHandler(
  async (request, response) => {
    const {
      name,
      category,
      subcategory,
      description,
      price,
      stock,
      images,
      variants,
      featured,
      latest,
      isActive,
    } = request.body;

    if (!name?.trim()) {
      response.status(400);
      throw new Error('Product name is required');
    }

    if (!category) {
      response.status(400);
      throw new Error('Category is required');
    }

    if (!description?.trim()) {
      response.status(400);
      throw new Error(
        'Product description is required'
      );
    }

    const normalizedVariants =
      normalizeVariants(variants);

    /*
     * IMPORTANT:
     *
     * Main product price and stock remain independent.
     *
     * Variants have their own price and stock.
     */

    const productPrice = Math.max(
      0,
      Number(price || 0)
    );

    const productStock = Math.max(
      0,
      Number(stock || 0)
    );

    const product = await Product.create({
      name: name.trim(),

      slug: slugify(name),

      category,

      subcategory:
        subcategory?.trim() || '',

      description:
        description.trim(),

      price: productPrice,

      stock: productStock,

      images:
        Array.isArray(images)
          ? images.filter(Boolean)
          : [],

      variants:
        normalizedVariants,

      featured:
        parseBoolean(featured),

      latest:
        parseBoolean(latest),

      isActive:
        parseBoolean(isActive, true),
    });

    const populatedProduct =
      await Product.findById(
        product._id
      ).populate('category');

    response.status(201).json({
      product: populatedProduct,
    });
  }
);

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

export const updateProduct = asyncHandler(
  async (request, response) => {
    const product =
      await Product.findById(
        request.params.id
      );

    if (!product) {
      response.status(404);
      throw new Error('Product not found');
    }

    const {
      name,
      slug,
      category,
      subcategory,
      description,
      price,
      stock,
      images,
      variants,
      featured,
      latest,
      isActive,
    } = request.body;

    if (name !== undefined) {
      product.name = name.trim();

      if (slug === undefined) {
        product.slug = slugify(name);
      }
    }

    if (slug !== undefined) {
      product.slug =
        slug?.trim() ||
        slugify(product.name);
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (subcategory !== undefined) {
      product.subcategory =
        subcategory;
    }

    if (description !== undefined) {
      product.description =
        description.trim();
    }

    if (price !== undefined) {
      product.price = Math.max(
        0,
        Number(price || 0)
      );
    }

    if (stock !== undefined) {
      product.stock = Math.max(
        0,
        Number(stock || 0)
      );
    }

    if (images !== undefined) {
      product.images =
        Array.isArray(images)
          ? images.filter(Boolean)
          : [];
    }

    if (variants !== undefined) {
      product.variants =
        normalizeVariants(variants);
    }

    if (featured !== undefined) {
      product.featured =
        parseBoolean(
          featured,
          product.featured
        );
    }

    if (latest !== undefined) {
      product.latest =
        parseBoolean(
          latest,
          product.latest
        );
    }

    if (isActive !== undefined) {
      product.isActive =
        parseBoolean(
          isActive,
          product.isActive
        );
    }

    await product.save();

    const updatedProduct =
      await Product.findById(
        product._id
      ).populate('category');

    response.json({
      product: updatedProduct,
    });
  }
);

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export const deleteProduct = asyncHandler(
  async (request, response) => {
    const product =
      await Product.findById(
        request.params.id
      );

    if (!product) {
      response.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();

    response.json({
      message:
        'Product deleted successfully',
    });
  }
);

/*
|--------------------------------------------------------------------------
| FEATURED PRODUCTS
|--------------------------------------------------------------------------
*/

export const getFeaturedProducts =
  asyncHandler(
    async (request, response) => {
      const products =
        await Product.find({
          featured: true,
          isActive: true,
        })
          .populate('category')
          .sort({
            createdAt: -1,
          })
          .limit(12);

      response.json({
        products,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| LATEST PRODUCTS
|--------------------------------------------------------------------------
*/

export const getLatestProducts =
  asyncHandler(
    async (request, response) => {
      const products =
        await Product.find({
          latest: true,
          isActive: true,
        })
          .populate('category')
          .sort({
            createdAt: -1,
          })
          .limit(12);

      response.json({
        products,
      });
    }
  );