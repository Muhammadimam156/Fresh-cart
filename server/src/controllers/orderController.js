import asyncHandler from 'express-async-handler';

import { Order } from '../models/orderModel.js';
import { OrderItem } from '../models/orderItemModel.js';
import { Product } from '../models/productModel.js';
import { Coupon } from '../models/couponModel.js';
import { notifyWhatsApp } from '../utils/notifyWhatsApp.js';


// ============================================================
// Generate unique Order ID
// ============================================================

function createOrderId() {
  return `FC-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;
}


// ============================================================
// CREATE ORDER
// ============================================================

export const createOrder = asyncHandler(async (request, response) => {
  const {
    customer,
    items,
    customerUser,
    couponCode,
  } = request.body;

  // ----------------------------------------------------------
  // Validate customer + items
  // ----------------------------------------------------------

  if (
    !customer?.fullName ||
    !customer?.phone ||
    !customer?.address ||
    !customer?.city ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    response.status(400);

    throw new Error(
      'Customer details and at least one order item are required'
    );
  }

  // ----------------------------------------------------------
  // Prepare items
  // ----------------------------------------------------------

  const sanitizedItems = [];

  let subtotal = 0;

  // ----------------------------------------------------------
  // Process every product
  // ----------------------------------------------------------

  for (const item of items) {
    if (!item.productId) {
      response.status(400);
      throw new Error('Product ID is required');
    }

    // Find product
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      response.status(400);
      throw new Error('One or more products are invalid');
    }

    // --------------------------------------------------------
    // Quantity
    // --------------------------------------------------------

    const quantity = Math.max(
      1,
      Number(item.quantity || 1)
    );


    // ========================================================
    // VARIANT PRODUCT
    // ========================================================

    let selectedVariant = null;

    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      if (!item.variantId) {
        response.status(400);

        throw new Error(
          `Please select a size/weight for ${product.name}`
        );
      }

      selectedVariant = product.variants.id(item.variantId);

      if (!selectedVariant) {
        response.status(400);

        throw new Error(
          `Selected variant is not available for ${product.name}`
        );
      }

      // ------------------------------------------------------
      // Check variant active
      // ------------------------------------------------------

      if (!selectedVariant.isActive) {
        response.status(400);

        throw new Error(
          `Selected variant of ${product.name} is not available`
        );
      }

      // ------------------------------------------------------
      // Check variant stock
      // ------------------------------------------------------

      if (selectedVariant.stock < quantity) {
        response.status(400);

        throw new Error(
          `Not enough stock for ${product.name} - ${selectedVariant.label}`
        );
      }

      // ------------------------------------------------------
      // IMPORTANT:
      // Never trust price coming from frontend.
      // Always use MongoDB variant price.
      // ------------------------------------------------------

      const price = Number(selectedVariant.price);

      const lineTotal = price * quantity;

      subtotal += lineTotal;


      // ------------------------------------------------------
      // Add sanitized variant item
      // ------------------------------------------------------

      sanitizedItems.push({
        product: product._id,

        productName: product.name,

        productImage:
          product.images?.[0] || '',

        variantId:
          selectedVariant._id?.toString() || '',

        variantLabel:
          selectedVariant.label || '',

        variantWeight:
          selectedVariant.weight ?? null,

        variantUnit:
          selectedVariant.unit || '',

        price,

        quantity,

        subtotal: lineTotal,
      });


      // ------------------------------------------------------
      // Reduce variant stock
      // ------------------------------------------------------

      selectedVariant.stock -= quantity;

      continue;
    }


    // ========================================================
    // NORMAL PRODUCT WITHOUT VARIANTS
    // ========================================================

    if (product.stock < quantity) {
      response.status(400);

      throw new Error(
        `Not enough stock for ${product.name}`
      );
    }

    const price = Number(product.price);

    const lineTotal = price * quantity;

    subtotal += lineTotal;


    sanitizedItems.push({
      product: product._id,

      productName: product.name,

      productImage:
        product.images?.[0] || '',

      variantId: '',

      variantLabel: '',

      variantWeight: null,

      variantUnit: '',

      price,

      quantity,

      subtotal: lineTotal,
    });


    // Reduce normal product stock
    product.stock -= quantity;

    await product.save();
  }


  // ============================================================
  // DELIVERY CHARGES
  // ============================================================

  const deliveryCharges = subtotal > 0 ? 150 : 0;


  // ============================================================
  // COUPON
  // ============================================================

  let discountAmount = 0;

  let appliedCoupon = null;


  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: String(couponCode).toUpperCase(),
      active: true,
    });


    if (coupon) {

      // ------------------------------------------------------
      // Check expiry
      // ------------------------------------------------------

      const expired =
        coupon.expiresAt &&
        coupon.expiresAt < new Date();


      // ------------------------------------------------------
      // Check maximum uses
      // ------------------------------------------------------

      const exhausted =
        coupon.maxUses > 0 &&
        coupon.uses >= coupon.maxUses;


      if (!expired && !exhausted) {

        appliedCoupon = coupon;


        // ----------------------------------------------------
        // Percentage discount
        // ----------------------------------------------------

        if (coupon.type === 'percent') {

          discountAmount = Math.round(
            (subtotal * Number(coupon.amount)) / 100
          );

        }

        // ----------------------------------------------------
        // Fixed amount discount
        // ----------------------------------------------------

        else {

          discountAmount = Number(
            coupon.amount
          );
        }


        // Never allow discount greater than subtotal
        discountAmount = Math.min(
          discountAmount,
          subtotal
        );
      }
    }
  }


  // ============================================================
  // GRAND TOTAL
  // ============================================================

  const grandTotal = Math.max(
    0,
    subtotal -
      discountAmount +
      deliveryCharges
  );


  // ============================================================
  // CREATE ORDER
  // ============================================================

  const order = await Order.create({
    orderId: createOrderId(),

    customer,

    customerUser:
      customerUser || request.user?._id || undefined,

    subtotal,

    couponCode:
      appliedCoupon?.code || '',

    discountAmount,

    deliveryCharges,

    grandTotal,

    paymentMethod:
      request.body.paymentMethod ||
      'Cash on Delivery',

    status: 'Pending',

    statusHistory: [
      {
        status: 'Pending',
        note: 'Order created',
        changedAt: new Date(),
      },
    ],
  });


  // ============================================================
  // CREATE ORDER ITEMS
  // ============================================================

  const createdOrderItems = [];


  for (const item of sanitizedItems) {

    const orderItem = await OrderItem.create({
      ...item,

      order: order._id,
    });


    createdOrderItems.push(
      orderItem._id
    );
  }


  // ------------------------------------------------------------
  // Attach order items to order
  // ------------------------------------------------------------

  order.orderItems =
    createdOrderItems;


  await order.save();


  // ============================================================
  // COUPON USAGE
  // ============================================================

  if (appliedCoupon) {

    appliedCoupon.uses =
      (appliedCoupon.uses || 0) + 1;

    await appliedCoupon.save();
  }


  // ============================================================
  // WHATSAPP NOTIFICATION
  // ============================================================

  try {

    const itemLines =
      sanitizedItems
        .map((item) => {

          const variantText =
            item.variantLabel
              ? ` (${item.variantLabel})`
              : '';

          return `${item.productName}${variantText} x ${item.quantity} = Rs. ${item.subtotal}`;
        })
        .join('\n');


    await notifyWhatsApp(
      [
        `🛒 New Order: ${order.orderId}`,

        `Customer: ${customer.fullName}`,

        `Phone: ${customer.phone}`,

        `City: ${customer.city}`,

        `Address: ${customer.address}`,

        '',

        `Items:`,

        itemLines,

        '',

        `Subtotal: Rs. ${subtotal}`,

        `Discount: Rs. ${discountAmount}`,

        `Delivery: Rs. ${deliveryCharges}`,

        `Total: Rs. ${grandTotal}`,

        '',

        `Payment: ${
          request.body.paymentMethod ||
          'Cash on Delivery'
        }`,
      ].join('\n')
    );

  } catch (whatsappError) {

    // WhatsApp failure should NOT cancel the order
    console.error(
      'WhatsApp notification failed:',
      whatsappError.message
    );
  }


  // ============================================================
  // RETURN COMPLETE ORDER
  // ============================================================

  const populatedOrder =
    await Order.findById(order._id)
      .populate('orderItems')
      .populate(
        'customerUser',
        'name email phone'
      );


  response.status(201).json({
    message: 'Order created successfully',

    order: populatedOrder,
  });
});


// ============================================================
// GET MY ORDERS
// ============================================================

export const getMyOrders = asyncHandler(
  async (request, response) => {

    const orders =
      await Order.find({
        customerUser: request.user._id,
      })
        .populate('orderItems')
        .sort({
          createdAt: -1,
        });


    response.json({
      orders,
    });
  }
);


// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getOrderById = asyncHandler(
  async (request, response) => {

    const order =
      await Order.findById(
        request.params.id
      )
        .populate('orderItems')
        .populate(
          'customerUser',
          'name email phone'
        );


    if (!order) {
      response.status(404);

      throw new Error(
        'Order not found'
      );
    }


    // ----------------------------------------------------------
    // Check ownership
    // ----------------------------------------------------------

    const isOwner =
      order.customerUser?._id?.toString() ===
      request.user?._id?.toString();


    if (
      request.user.role !== 'admin' &&
      !isOwner
    ) {
      response.status(403);

      throw new Error(
        'Not authorized to view this order'
      );
    }


    response.json({
      order,
    });
  }
);


// ============================================================
// GET ALL ORDERS - ADMIN
// ============================================================

export const getAllOrders = asyncHandler(
  async (_request, response) => {

    const orders =
      await Order.find()
        .populate('orderItems')
        .populate(
          'customerUser',
          'name email phone'
        )
        .sort({
          createdAt: -1,
        });


    response.json({
      orders,
    });
  }
);


// ============================================================
// UPDATE ORDER STATUS - ADMIN
// ============================================================

export const updateOrderStatus = asyncHandler(
  async (request, response) => {

    const {
      status,
      note = '',
    } = request.body;


    // ----------------------------------------------------------
    // Validate status
    // ----------------------------------------------------------

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Delivered',
      'Cancelled',
    ];


    if (
      !allowedStatuses.includes(status)
    ) {
      response.status(400);

      throw new Error(
        'Invalid order status'
      );
    }


    // ----------------------------------------------------------
    // Find order
    // ----------------------------------------------------------

    const order =
      await Order.findById(
        request.params.id
      );


    if (!order) {
      response.status(404);

      throw new Error(
        'Order not found'
      );
    }


    // ----------------------------------------------------------
    // Update status
    // ----------------------------------------------------------

    order.status =
      status;


    order.statusHistory.push({
      status,

      note,

      changedAt:
        new Date(),
    });


    await order.save();


    // ----------------------------------------------------------
    // Return updated order
    // ----------------------------------------------------------

    const updatedOrder =
      await Order.findById(
        order._id
      )
        .populate('orderItems')
        .populate(
          'customerUser',
          'name email phone'
        );


    response.json({
      message:
        `Order marked as ${status}`,

      order:
        updatedOrder,
    });
  }
);