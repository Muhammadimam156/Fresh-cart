import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', protect, getCurrentUser);
authRouter.put('/profile', protect, updateProfile);
authRouter.put('/change-password', protect, changePassword);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
