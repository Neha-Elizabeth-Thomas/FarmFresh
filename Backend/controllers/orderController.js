import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Payment from '../models/paymentModel.js';
import User from '../models/userModel.js';

/*============================================
=            CREATE ORDER                   =
============================================*/
// @desc    Create an order
// @route   POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  let totalAmount = 0;
  const ordersToCreate = [];

  for (const item of items) {
    const product = await Product.findById(item.product_id);

    if (!product || !product.is_active) {
      res.status(404);
      throw new Error(`Product ${item.product_id} not found or inactive`);
    }

    if (product.quantity < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product ${product.product_name}`);
    }

    // Decrement stock
    product.quantity -= item.quantity;
    await product.save();

    const order = new Order({
      user_id: req.user._id,
      seller_id: product.seller_id,
      items: [
        {
          product_id: product._id,
          quantity: item.quantity,
          price: product.price,
        },
      ],
      total_amount: (product.price * item.quantity).toFixed(2),
      shippingAddress,
    });

    totalAmount += parseFloat(order.total_amount);
    ordersToCreate.push(order);
  }

  const createdOrders = await Order.insertMany(ordersToCreate);
  res.status(201).json({
    message: 'Order(s) created',
    orders: createdOrders,
    totalAmount: totalAmount.toFixed(2),
  });
});

/*============================================
=              GET ORDER BY ID              =
============================================*/
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user_id', 'name email')
    .populate('seller_id', 'name email')
    .populate('items.product_id', 'product_name');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Allow access only if user is buyer or seller involved
  if (
    order.user_id._id.toString() !== req.user._id.toString() &&
    order.seller_id._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

/*============================================
=            GET MY (BUYER) ORDERS          =
============================================*/
// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user_id: req.user._id })
    .sort({ created_at: -1 })
    // Populate the product details for each item in the order
    .populate({
      path: 'items.product_id', // The path to the field you want to populate
      select: 'product_name product_image' // Select only the fields you need for the frontend
    });
    
  res.json(orders);
});

/*============================================
=         GET SELLER’S ORDERS               =
============================================*/
// @desc    Get orders where the logged-in user is the seller
// @route   GET /api/orders/seller
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller_id: req.user._id }).sort({ created_at: -1 });
  res.json(orders);
});

/*============================================
=     UPDATE ORDER STATUS: SHIPPED/DELIVERED=
============================================*/
// @desc    Mark order as shipped
// @route   PUT /api/orders/:id/ship
export const updateOrderStatusToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.seller_id.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }

  order.status = 'shipped';
  await order.save();
  res.json({ message: 'Order marked as shipped' });
});

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
export const updateOrderStatusToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.seller_id.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }

  order.status = 'delivered';
  await order.save();
  res.json({ message: 'Order marked as delivered' });
});

/**
 * @desc    Get aggregated data for the seller dashboard
 * @route   GET /api/dashboard/seller
 * @access  Private/Seller
 */
export const getSellerDashboardData = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // --- 1. Top-level Statistics ---
  const totalOrders = await Order.countDocuments({ seller_id: sellerId });
  const totalProducts = await Product.countDocuments({ seller_id: sellerId });

  const salesData = await Order.aggregate([
    { $match: { seller_id: sellerId, status: { $in: ['paid', 'shipped', 'delivered'] } } },
    { $group: { _id: null, totalSell: { $sum: "$total_amount" } } }
  ]);
  const totalSell = salesData.length > 0 ? salesData[0].totalSell : 0;

  // --- 2. Order Summary ---
  const orderStatusSummary = await Order.aggregate([
      { $match: { seller_id: sellerId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const orderSummary = {
      pending: orderStatusSummary.find(s => s._id === 'pending')?.count || 0,
      shipped: orderStatusSummary.find(s => s._id === 'shipped')?.count || 0,
      delivered: orderStatusSummary.find(s => s._id === 'delivered')?.count || 0,
      total: totalOrders,
  };

  // --- 3. Recent Orders (Buy Requests) ---
  const recentOrders = await Order.find({ seller_id: sellerId })
    .populate({
        path: 'items.product_id',
        select: 'product_name'
    })
    .sort({ created_at: -1 })
    .limit(5);
  
  // --- 4. Seller's Products ---
   const sellerProducts = await Product.find({ seller_id: sellerId }).limit(5);


  res.json({
    stats: {
      totalOrders: { value: totalOrders, change: 0 }, // Change calculation would require historical data
      totalSell: { value: totalSell, change: 0 },
      totalProducts: { value: totalProducts, change: 0 },
    },
    orderSummary,
    recentOrders,
    yourProducts: sellerProducts,
  });
});
