import asyncHandler from 'express-async-handler';
import razorpayInstance from '../configs/razorpay.js';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  // FIX: Accept amount and receipt directly from the frontend request
  const { amount, receipt } = req.body;

  if (!amount || !receipt) {
    res.status(400);
    throw new Error('Amount and receipt are required');
  }

  const options = {
    amount: parseFloat(amount) * 100, // Amount in paise
    currency: 'INR',
    receipt: receipt, // Use the database order ID as the receipt
  };

  try {
    const razorpayOrder = await razorpayInstance.orders.create(options);
    
    // Send back the details needed for the frontend checkout
    res.status(201).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500);
    throw new Error('Could not create payment order');
  }
});

// @desc    Verify a Razorpay payment and update order(s)
// @route   POST /api/payments/verify-payment
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  // FIX: Accept orderIds from the frontend
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderIds) {
    res.status(400);
    throw new Error('Payment verification details are missing');
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // If signature is authentic, payment is successful.
    
    // FIX: Update all orders passed from the frontend
    for (const orderId of orderIds) {
        const order = await Order.findById(orderId);
        if (order) {
            order.status = 'paid';
            await order.save();

            // Create a corresponding Payment document for each order
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
        }
    }
    
    res.status(200).json({
      message: 'Payment verified successfully.',
      paymentId: razorpay_payment_id,
    });

  } else {
    res.status(400);
    throw new Error('Invalid payment signature. Payment verification failed.');
  }
});

export { createRazorpayOrder, verifyRazorpayPayment };
