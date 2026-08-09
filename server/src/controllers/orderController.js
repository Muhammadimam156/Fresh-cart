import asyncHandler from 'express-async-handler';
import { Order } from '../models/orderModel.js';
import { OrderItem } from '../models/orderItemModel.js';
import { Product } from '../models/productModel.js';
import { notifyWhatsApp } from '../utils/notifyWhatsApp.js';
import { Coupon } from '../models/couponModel.js';

function createOrderId() {
  return `FC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export const createOrder = asyncHandler(async (request, response) => {
  const { customer, items, customerUser, couponCode } = request.body;

  if (!customer?.fullName || !customer?.phone || !customer?.address || !customer?.city || !Array.isArray(items) || items.length === 0) {
    response.status(400);
    throw new Error('Customer details and at least one order item are required');
  }

  const sanitizedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      response.status(400);
      throw new Error('One or more products are invalid');
    }

    const quantity = Math.max(1, Number(item.quantity || 1));
    const lineTotal = Number(product.price) * quantity;
    subtotal += lineTotal;
    sanitizedItems.push({
      product: product._id,
      productName: product.name,
      productImage: product.images[0] || '',
      price: Number(product.price),
      quantity,
      subtotal: lineTotal,
    });
  }

  const deliveryCharges = subtotal > 0 ? 150 : 0;

  // Apply coupon if provided
  let discountAmount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
    if (coupon) {
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        // expired - ignore
      } else if (coupon.maxUses > 0 && coupon.uses >= coupon.maxUses) {
        // exhausted - ignore
      } else {
        appliedCoupon = coupon;
        if (coupon.type === 'percent') {
          discountAmount = Math.round((subtotal * coupon.amount) / 100);
        } else {
          discountAmount = Number(coupon.amount);
        }
      }
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharges);

  const order = await Order.create({
    orderId: createOrderId(),
    customer,
    customerUser,
    subtotal,
    couponCode: appliedCoupon?.code || '',
    discountAmount,
    deliveryCharges,
    grandTotal,
    statusHistory: [{ status: 'Pending', note: 'Order created' }],
  });

  const createdOrderItems = [];
  for (const item of sanitizedItems) {
    const orderItem = await OrderItem.create({ ...item, order: order._id });
    createdOrderItems.push(orderItem._id);
  }

  order.orderItems = createdOrderItems;
  await order.save();

  // increment coupon usage
  if (appliedCoupon) {
    appliedCoupon.uses = (appliedCoupon.uses || 0) + 1;
    await appliedCoupon.save();
  }

  await notifyWhatsApp(
    [
      `New grocery order: ${order.orderId}`,
      `Customer: ${customer.fullName}`,
      `Phone: ${customer.phone}`,
      `Total: Rs. ${grandTotal}`,
      `Items: ${items.length}`,
    ].join('\n')
  );

  response.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async (request, response) => {
  const orders = await Order.find({ customerUser: request.user._id }).populate('orderItems').sort({ createdAt: -1 });
  response.json({ orders });
});

export const getOrderById = asyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate('orderItems').populate('customerUser', 'name email phone');
  if (!order) {
    response.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.customerUser?._id?.toString() === request.user?._id?.toString();
  if (request.user.role !== 'admin' && !isOwner) {
    response.status(403);
    throw new Error('Not authorized to view this order');
  }

  response.json({ order });
});

export const getAllOrders = asyncHandler(async (_, response) => {
  const orders = await Order.find().populate('orderItems').populate('customerUser', 'name email phone').sort({ createdAt: -1 });
  response.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (request, response) => {
  const { status, note = '' } = request.body;
  const order = await Order.findById(request.params.id);
  if (!order) {
    response.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  order.statusHistory.push({ status, note, changedAt: new Date() });
  await order.save();

  response.json({ order });
});
