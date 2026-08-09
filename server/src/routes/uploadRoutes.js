import { Router } from 'express';
import multer from 'multer';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../controllers/uploadController.js';

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadRouter = Router();

uploadRouter.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  uploadSingleImage
);