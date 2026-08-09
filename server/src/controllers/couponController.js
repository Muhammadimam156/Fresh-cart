import asyncHandler from 'express-async-handler';
import { Coupon } from '../models/couponModel.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, type = 'percent', amount, expiresAt, maxUses = 0 } = req.body;
  if (!code || !amount) {
    res.status(400);
    throw new Error('Code and amount are required');
  }
  const coupon = await Coupon.create({ code: code.toUpperCase(), type, amount, expiresAt, maxUses });
  res.status(201).json({ coupon });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error('Coupon code required');
  }
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) {
    res.json({ valid: false, message: 'Invalid coupon' });
    return;
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.json({ valid: false, message: 'Coupon expired' });
    return;
  }
  if (coupon.maxUses > 0 && coupon.uses >= coupon.maxUses) {
    res.json({ valid: false, message: 'Coupon usage limit reached' });
    return;
  }

  res.json({ valid: true, coupon: { code: coupon.code, type: coupon.type, amount: coupon.amount } });
});
