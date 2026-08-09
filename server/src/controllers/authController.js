import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export const registerUser = asyncHandler(async (request, response) => {
  const { name, email, phone, password } = request.body;

  if (!name || !email || !password) {
    response.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    response.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, phone, password: hashedPassword });

  response.status(201).json({ user: publicUser(user), token: generateToken(user._id) });
});

export const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    response.status(401);
    throw new Error('Invalid email or password');
  }

  response.json({ user: publicUser(user), token: generateToken(user._id) });
});

export const logoutUser = asyncHandler(async (_, response) => {
  response.json({ message: 'Logged out successfully' });
});

export const getCurrentUser = asyncHandler(async (request, response) => {
  response.json({ user: publicUser(request.user) });
});

export const updateProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id).select('+password');
  if (!user) {
    response.status(404);
    throw new Error('User not found');
  }

  user.name = request.body.name ?? user.name;
  user.email = request.body.email ?? user.email;
  user.phone = request.body.phone ?? user.phone;

  await user.save();
  response.json({ user: publicUser(user) });
});

export const changePassword = asyncHandler(async (request, response) => {
  const { currentPassword, newPassword } = request.body;
  const user = await User.findById(request.user._id).select('+password');

  if (!user || !(await bcrypt.compare(currentPassword || '', user.password))) {
    response.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  response.json({ message: 'Password updated successfully' });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  const { email } = request.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    response.status(404);
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpiresAt = Date.now() + 1000 * 60 * 30;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your FreshCart password',
    html: `<p>Reset your password using this link: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  response.json({ message: 'Password reset instructions sent', resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken });
});

export const resetPassword = asyncHandler(async (request, response) => {
  const { token, password } = request.body;
  const tokenHash = crypto.createHash('sha256').update(token || '').digest('hex');
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    response.status(400);
    throw new Error('Reset token is invalid or expired');
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  response.json({ message: 'Password reset successful' });
});
