import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'e-commerce-ids', // The name of the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file formats
    // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional transformations
  },
});

export { cloudinary, storage };
