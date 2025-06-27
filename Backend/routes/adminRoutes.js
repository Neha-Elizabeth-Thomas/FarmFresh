import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllSellers,
  verifySeller,
  getAllOrders,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authentication.js';

const router = express.Router();

// All routes in this file are protected and admin-only
router.use(protect, adminOnly);

/*============================================
=            User Management (Admin)         =
============================================*/
// @route   /api/admin/users

router.route('/users').get(getAllUsers);
router
  .route('/users/:id')
  .get(getUserById)
  .put(updateUserByAdmin)
  .delete(deleteUserByAdmin);

/*============================================
=           Seller Management (Admin)        =
============================================*/
// @route   /api/admin/sellers

router.route('/sellers').get(getAllSellers);
router.route('/sellers/:id/verify').put(verifySeller); // Admin verifies a seller's profile

/*============================================
=            Order Management (Admin)         =
============================================*/
// @route   /api/admin/orders

router.route('/orders').get(getAllOrders); // Admin can see all orders in the system

export default router;
