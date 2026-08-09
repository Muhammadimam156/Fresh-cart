import dotenv from 'dotenv';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { createApp } from './app.js';




console.log('CLOUDINARY TEST:', {
  cloud: !!process.env.CLOUDINARY_CLOUD_NAME,
  key: !!process.env.CLOUDINARY_API_KEY,
  secret: !!process.env.CLOUDINARY_API_SECRET,
});

const app = createApp();

const port = process.env.PORT || 5000;

async function start() {
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.warn(
      'MONGO_URI is not set; starting server without a database connection for now.'
    );
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});