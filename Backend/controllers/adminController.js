import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

/*=========================================
=            USER MANAGEMENT              =
=========================================*/

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc    Update user by admin
// @route   PUT /api/admin/users/:id
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

/*=========================================
=           SELLER MANAGEMENT             =
=========================================*/

// @desc    Get all sellers
// @route   GET /api/admin/sellers
export const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: { $in: ['seller'] } }).select('-password');
  res.json(sellers);
});

// @desc    Verify a seller
// @route   PUT /api/admin/sellers/:id/verify
export const verifySeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || !user.role.includes('seller')) {
    res.status(404);
    throw new Error('Seller not found');
  }

  user.sellerProfile.isVerified = true;
  user.sellerProfile.verifiedAt = new Date();

  const updatedSeller = await user.save();
  res.json({ message: 'Seller verified successfully', seller: updatedSeller });
});

/*=========================================
=           ORDER MANAGEMENT              =
=========================================*/

// @desc    Get all orders
// @route   GET /api/admin/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user_id', 'name email')
    .populate('seller_id', 'name email')
    .populate('items.product_id', 'product_name');

  res.json(orders);
});
