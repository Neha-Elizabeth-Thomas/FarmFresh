import asyncHandler from 'express-async-handler';
import razorpayInstance from '../configs/razorpay.js';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  // 1. Find the order from your database
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // 2. Prepare Razorpay order options
  const options = {
    amount: parseFloat(order.total_amount.toString()) * 100, // Amount in paise
    currency: 'INR',
    receipt: order._id.toString(), // A unique receipt ID for this order
  };

  try {
    // 3. Create the order with Razorpay
    const razorpayOrder = await razorpayInstance.orders.create(options);
    
    // 4. Send the order details to the frontend
    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500);
    throw new Error('Could not create payment order');
  }
});

// @desc    Verify a Razorpay payment
// @route   POST /api/payments/verify-payment
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification details are missing');
  }

  // 1. Recreate the signature on the backend
  // The body should be: razorpay_order_id + "|" + razorpay_payment_id
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  // 2. Compare the generated signature with the one from the client
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // 3. If signature is authentic, payment is successful.
    // Find the original order in your DB using the receipt (which was the order_id)
    const order = await Order.findOne({ _id: receiptIdFromRazorpayOrder }); // You would get receiptId from a webhook or DB lookup
    
    // Update the Order status to 'paid'
    order.status = 'paid';
    await order.save();
    
    // Create a new Payment document
    await Payment.create({
      order_id: order._id,
      user_id: order.user_id,
      seller_id: order.seller_id,
      amount: order.total_amount,
      platform_fee: parseFloat(order.total_amount.toString()) * 0.05, // Example 5% fee
      seller_receives: parseFloat(order.total_amount.toString()) * 0.95, // Example 95% to seller
      payment_status: 'success',
      payment_method: 'Razorpay',
      transaction_id: razorpay_payment_id,
    });
    
    res.status(200).json({
      message: 'Payment verified successfully.',
      paymentId: razorpay_payment_id,
    });

  } else {
    // 4. If signature is not authentic, payment has been tampered with.
    res.status(400);
    throw new Error('Invalid payment signature. Payment verification failed.');
  }
});

export { createRazorpayOrder, verifyRazorpayPayment };
