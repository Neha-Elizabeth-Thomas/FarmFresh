// middleware/uploadMiddleware.js
import multer from 'multer';
import { govIDProofStorage, productImageStorage } from '../configs/cloudinary.js';

/**
 * Allowed formats: jpg, png, jpeg, pdf
 */
const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

/**
 * File filter to restrict types
 */
const fileFilter = (req, file, cb) => {
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPG, PNG, JPEG, and PDF files are allowed.'),
      false
    );
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 5MB
};

/**
 * Upload single government ID proof
 * Field: govIDProof
 */
export const uploadGovID = multer({
  storage: govIDProofStorage,
  fileFilter,
  limits,
}).single('govIDProof');

/**
 * Upload up to 5 product images
 * Field: images
 */
export const uploadProductImages = multer({
  storage: productImageStorage,
  fileFilter,
  limits,
}).array('images', 5);
