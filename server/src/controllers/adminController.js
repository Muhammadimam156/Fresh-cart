import asyncHandler from 'express-async-handler';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { Order } from '../models/orderModel.js';
import { ContactMessage } from '../models/contactMessageModel.js';
import { Setting } from '../models/settingModel.js';

export const getDashboardSummary = asyncHandler(async (_, response) => {
  const [totalOrders, totalCustomers, totalProducts, recentOrders] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
    Order.find().populate('orderItems').populate('customerUser', 'name phone email').sort({ createdAt: -1 }).limit(5),
  ]);

  response.json({
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
  });
});

export const getCustomers = asyncHandler(async (_, response) => {
  const customers = await User.find({ role: 'customer' }).select('name email phone createdAt').sort({ createdAt: -1 });
  response.json({ customers });
});

export const getCustomerOrders = asyncHandler(async (request, response) => {
  const orders = await Order.find({ customerUser: request.params.id }).populate('orderItems').sort({ createdAt: -1 });
  response.json({ orders });
});

export const getMessages = asyncHandler(async (_, response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  response.json({ messages });
});

export const getStoreSettings = asyncHandler(async (_, response) => {
  const setting = (await Setting.findOne().sort({ createdAt: -1 })) || (await Setting.create({}));
  response.json({ setting });
});
