import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/me', protect, getMyOrders);
orderRouter.get('/', protect, adminOnly, getAllOrders);
orderRouter.get('/:id', protect, getOrderById);
orderRouter.patch('/:id/status', protect, adminOnly, updateOrderStatus);
