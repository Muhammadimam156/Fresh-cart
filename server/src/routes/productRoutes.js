import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getLatestProducts,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';

export const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/featured/list', getFeaturedProducts);
productRouter.get('/latest/list', getLatestProducts);
productRouter.get('/:slug', getProductBySlug);
productRouter.post('/', protect, adminOnly, createProduct);
productRouter.put('/:id', protect, adminOnly, updateProduct);
productRouter.delete('/:id', protect, adminOnly, deleteProduct);
