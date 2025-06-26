import multer from 'multer';
import { storage } from '../configs/cloudinary.js';

/**
 * Multer middleware configured for Cloudinary.
 * This expects a single file from a form field named 'govIDProof'.
 * On successful upload, req.file will contain the file details from Cloudinary.
 */
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // You can add more complex file filtering logic here if needed
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  }
});

// We are exporting a configured middleware instance to handle a single file upload.
// The field name 'govIDProof' must match the name attribute of the file input in your front-end form.
const uploadGovID = upload.single('govIDProof');

export default uploadGovID;
