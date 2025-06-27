import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  createProductReview,
  getTopRatedProducts,
  getProductsByCategory,
} from '../controllers/productController.js';
import { protect, sellerOnly } from '../middleware/authentication.js';
// Assuming you have a middleware for product image uploads
import { uploadProductImages } from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

/*============================================
=              Public Routes                 =
============================================*/
// @route   /api/products

router.get('/', getAllProducts); // Includes search, filter, and pagination
router.get('/top', getTopRatedProducts);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/:id', getProductById);

/*============================================
=       Product Management (Seller)          =
============================================*/
// @route   /api/products

router
  .route('/')
  .post(protect, sellerOnly, uploadProductImages, createProduct); // Seller creates product

router
  .route('/:id')
  .put(protect, sellerOnly, uploadProductImages, updateProduct) // Seller updates product
  .delete(protect, sellerOnly, deleteProduct); // Seller deletes product

/*============================================
=           Product Reviews (Buyer)          =
============================================*/
// @route   /api/products/:id/reviews

router.route('/:id/reviews').post(protect, createProductReview); // Any authenticated user can review

export default router;
