import { Router } from 'express';
import { createCoupon, validateCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

export const couponRouter = Router();

couponRouter.post('/', protect, adminOnly, createCoupon);
couponRouter.post('/validate', validateCoupon);
