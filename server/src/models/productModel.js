import mongoose from 'mongoose';

const variantSchema =
  new mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
      },

      label: {
        type: String,
        default: '',
      },

      weight: {
        type: Number,
        required: true,
        min: 0,
      },

      unit: {
        type: String,
        default: 'kg',
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      stock: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

const productSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },

      subcategory: {
        type: String,
        default: '',
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      /*
       * Main product price.
       * This is NOT variant price.
       */

      price: {
        type: Number,
        default: 0,
        min: 0,
      },

      /*
       * Main product stock.
       * This is NOT variant stock.
       */

      stock: {
        type: Number,
        default: 0,
        min: 0,
      },

      images: {
        type: [String],
        default: [],
      },

      variants: {
        type: [variantSchema],
        default: [],
      },

      featured: {
        type: Boolean,
        default: false,
      },

      latest: {
        type: Boolean,
        default: false,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const Product =
  mongoose.model(
    'Product',
    productSchema
  );