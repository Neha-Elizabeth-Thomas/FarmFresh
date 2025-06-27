// configs/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

// Base cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed formats
const allowedFormats = ['jpg', 'png', 'jpeg', 'pdf'];

/*==============================
=  Storage for Gov ID Proofs   =
==============================*/
export const govIDProofStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce/govIDProofs', 
    allowedFormats,
    resource_type: 'auto',
    public_id: (req, file) => {
      const userId = (req.user?.name || req.body.name)|| 'unknown';
      return `govID_${userId}_${Date.now()}`;
    },
  },
});

/*===================================
=  Storage for Product Images       =
=  Folder: ecommerce/products/<name> =
====================================*/
export const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const name = req.body.product_name || 'product';
    const safeName = name.trim().replace(/\s+/g, '_');
    return {
      folder: `ecommerce/products/${safeName}`,
      allowedFormats,
      public_id: `${safeName}_${Date.now()}`,
    };
  },
});

export { cloudinary };
