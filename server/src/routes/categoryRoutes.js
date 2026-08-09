import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategoryBySlug, updateCategory } from '../controllers/categoryController.js';

export const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/:slug', getCategoryBySlug);
categoryRouter.post('/', protect, adminOnly, createCategory);
categoryRouter.put('/:id', protect, adminOnly, updateCategory);
categoryRouter.delete('/:id', protect, adminOnly, deleteCategory);
