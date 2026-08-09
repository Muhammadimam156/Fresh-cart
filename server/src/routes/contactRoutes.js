import { Router } from 'express';
import { createContactMessage, getContactMessages } from '../controllers/contactController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

export const contactRouter = Router();

contactRouter.post('/', createContactMessage);
contactRouter.get('/', protect, adminOnly, getContactMessages);
