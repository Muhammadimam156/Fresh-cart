import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary configuration is missing. Please check your .env file.'
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
}

export function uploadBufferToCloudinary(
  buffer,
  folder = 'grocery-products'
) {
  return new Promise((resolve, reject) => {
    console.log('☁️ Starting Cloudinary upload...');
    console.log('Buffer size:', buffer.length);

    try {
      const configuredCloudinary = configureCloudinary();

      console.log('☁️ Cloudinary configured');
      console.log('☁️ Sending file to Cloudinary...');

      const uploadStream =
        configuredCloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              reject(error);
              return;
            }

            console.log('✅ Cloudinary upload successful');
            console.log('URL:', result.secure_url);

            resolve(result);
          }
        );

      Readable.from(buffer).pipe(uploadStream);
    } catch (error) {
      console.error('❌ Cloudinary setup error:', error);
      reject(error);
    }
  });
}