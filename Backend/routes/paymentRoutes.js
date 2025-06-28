import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();

/*============================================
=            Payment Gateway Routes          =
============================================*/
// @route   /api/payments

// All payment routes should be protected
router.use(protect);

// Route to get Razorpay Key ID
router.get('/getkey', (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

export default router;
