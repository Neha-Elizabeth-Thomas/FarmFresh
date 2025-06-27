import express from 'express';
import {
  registerBuyer,
  loginUser,
  logout,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  forgotPassword,
  resetPassword,
  updateUserAddress,
  deleteUserAddress,
  checkUserStatus,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authentication.js';

const router = express.Router();

/*============================================
=            Authentication Routes           =
============================================*/
// @route   /api/users

router.post('/register/buyer', registerBuyer);
router.post('/login', loginUser);
router.post('/logout', logout);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

/*============================================
=            User Profile Routes             =
============================================*/
// @route   /api/users/profile

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

router.get('/check',protect,checkUserStatus);

/*============================================
=         User Address Management            =
============================================*/
// @route   /api/users/address

router.put('/address', protect, updateUserAddress); // Add/update a delivery address
router.delete('/address/:addressId', protect, deleteUserAddress); // Delete a specific address

export default router;
