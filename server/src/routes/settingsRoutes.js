import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

export const settingsRouter = Router();

settingsRouter.get('/', getSettings);
settingsRouter.put('/', protect, adminOnly, updateSettings);
