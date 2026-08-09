import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { getCustomers, getCustomerOrders, getDashboardSummary, getMessages, getStoreSettings } from '../controllers/adminController.js';

export const adminRouter = Router();

adminRouter.get('/dashboard', protect, adminOnly, getDashboardSummary);
adminRouter.get('/customers', protect, adminOnly, getCustomers);
adminRouter.get('/customers/:id/orders', protect, adminOnly, getCustomerOrders);
adminRouter.get('/messages', protect, adminOnly, getMessages);
adminRouter.get('/settings', protect, adminOnly, getStoreSettings);
