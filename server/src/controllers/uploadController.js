import asyncHandler from 'express-async-handler';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';

export const uploadSingleImage = asyncHandler(async (request, response) => {
  console.log('📤 File received by controller');

  if (!request.file) {
    response.status(400);
    throw new Error('No file uploaded');
  }

  console.log('☁️ Uploading to Cloudinary...');

  const result = await uploadBufferToCloudinary(request.file.buffer);

  console.log('✅ Cloudinary upload completed');

  const responseData = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  console.log('📦 Response data ready:', responseData);

  return response.status(201).json(responseData);
});