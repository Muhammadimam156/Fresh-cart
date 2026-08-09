import asyncHandler from 'express-async-handler';
import { ContactMessage } from '../models/contactMessageModel.js';

export const createContactMessage = asyncHandler(async (request, response) => {
  const { name, phone, email, message } = request.body;
  const contactMessage = await ContactMessage.create({ name, phone, email, message });
  response.status(201).json({ contactMessage });
});

export const getContactMessages = asyncHandler(async (_, response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  response.json({ messages });
});
