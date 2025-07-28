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
  const sellers = await User.find({role: 'seller'}).select('-password');
  res.json(sellers);
});

// @desc    Verify a seller
// @route   PUT /api/admin/sellers/:id/verify
export const verifySeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || !user.role === 'seller') {
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

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalSellers = await User.countDocuments({ role: 'seller' });
  const pendingSellers = await User.countDocuments({ role: 'seller', 'sellerProfile.isVerified': false });

  const salesData = await Order.aggregate([
    { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$total_amount' } } }
  ]);
  const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;

  res.json({
    totalUsers,
    totalSellers,
    totalRevenue: totalRevenue.toString(),
    pendingSellers,
  });
});


/**
 * @desc    Get detailed data for the main admin dashboard
 * @route   GET /api/admin/dashboard-details
 * @access  Private/Admin
 */
export const getAdminDashboardDetails = asyncHandler(async (req, res) => {
    // 1. Sales Analytics (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Set to the beginning of the day

    // Fetch sales data from the database
    const salesDataFromDB = await Order.aggregate([
        { $match: { created_at: { $gte: sevenDaysAgo }, status: { $in: ['paid', 'shipped', 'delivered','pending'] } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                totalSales: { $sum: { $toDouble: "$total_amount" } } // Ensure conversion from Decimal128
            }
        },
    ]);

    // Create a map for easy lookups (e.g., "2025-07-28" -> 3000)
    const salesMap = new Map(salesDataFromDB.map(item => [item._id, item.totalSales]));

    // Generate a complete array for the last 7 days
    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
        
        salesByDay.push({
            date: dateString,
            totalSales: salesMap.get(dateString) || 0 // Use the sales data or default to 0
        });
    }

    // 2. Recent Activity
    const recentOrders = await Order.find().sort({ created_at: -1 }).limit(5).populate('user_id', 'name');
    const recentUsers = await User.find().sort({ created_at: -1 }).limit(5).select('name role');

    // 3. Top Performers
    const topProducts = await Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.product_id", totalSold: { $sum: "$items.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: "$productDetails" }
    ]);

    const topSellers = await Order.aggregate([
        { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
        { $group: { _id: "$seller_id", totalRevenue: { $sum: "$total_amount" } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'sellerDetails' } },
        { $unwind: "$sellerDetails" }
    ]);

    res.json({
        salesByDay,
        recentActivity: {
            orders: recentOrders,
            users: recentUsers
        },
        topPerformers: {
            products: topProducts,
            sellers: topSellers
        }
    });
});
