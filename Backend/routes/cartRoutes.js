import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();

/*============================================
=             Cart Management Routes         =
============================================*/
// @route   /api/cart

// Chain all methods to the base route for a clean API
router
  .route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router
  .route('/:productId')
  .put(protect, updateCartItemQuantity)
  .delete(protect, removeFromCart);

export default router;
