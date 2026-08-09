import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/userModel.js';

export const protect = asyncHandler(async (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    response.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = authHeader.slice(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    response.status(401);
    throw new Error('Not authorized, user not found');
  }

  request.user = user;
  next();
});

export const adminOnly = (request, response, next) => {
  if (request.user?.role !== 'admin') {
    response.status(403);
    throw new Error('Admin access required');
  }

  next();
};