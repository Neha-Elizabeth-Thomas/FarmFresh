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
  const orders = await Order.find({ user_id: req.user._id }).sort({ created_at: -1 });
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
