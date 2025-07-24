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
  getHomepageProducts,
  setProductFlags,
  getHomepageReviews,
  getRelatedProducts,
  getReviewsForProduct
} from '../controllers/productController.js';
import { protect, sellerOnly ,adminOnly} from '../middleware/authentication.js';
// Assuming you have a middleware for product image uploads
import { uploadProductImages } from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

/*============================================
=              Public Routes                 =
============================================*/
// @route   /api/products

router.get('/', getAllProducts); // Includes search, filter, and pagination
router.get('/top', getTopRatedProducts);
router.get('/homepage', getHomepageProducts);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
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
router.get('/homepage/reviews', getHomepageReviews);
router.route('/:id/reviews').post(protect, createProductReview); // Any authenticated user can review
router.get('/:productId/reviews', getReviewsForProduct);


router.put('/:id/flags', protect, adminOnly, setProductFlags);

export default router;
