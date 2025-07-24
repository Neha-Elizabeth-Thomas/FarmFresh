import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getSellerOrders,
  updateOrderStatusToShipped,
  updateOrderStatusToDelivered,
  getSellerDashboardData
} from '../controllers/orderController.js';
import { protect, sellerOnly, adminOnly } from '../middleware/authentication.js';

const router = express.Router();

/*============================================
=           Order Creation & Payment         =
============================================*/
// @route   /api/orders

router.route('/').post(protect, createOrder);
/*============================================
=           Order Retrieval Routes           =
============================================*/
// @route   /api/orders

router.route('/myorders').get(protect, getMyOrders); // Buyer gets their own orders
router.get('/seller', protect, sellerOnly, getSellerDashboardData);
router.route('/:id').get(protect, getOrderById); // User/seller gets a specific order they are part of

/*============================================
=         Order Status Update Routes         =
============================================*/
// @route   /api/orders

router.route('/:id/ship').put(protect, sellerOnly, updateOrderStatusToShipped);
router.route('/:id/deliver').put(protect, sellerOnly, updateOrderStatusToDelivered);

// Admin might have special power to cancel any order
// router.route('/:id/cancel').put(protect, adminOnly, cancelOrder); 

export default router;
