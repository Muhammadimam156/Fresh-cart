import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productImage: {
      type: String,
      default: '',
    },

    // Variant information
    variantId: {
      type: String,
      default: '',
    },

    variantLabel: {
      type: String,
      default: '',
    },

    variantWeight: {
      type: Number,
      default: null,
    },

    variantUnit: {
      type: String,
      default: '',
    },

    // Price of selected variant
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // price × quantity
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model(
  'OrderItem',
  orderItemSchema
);