import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes and exports the Razorpay instance.
 * It's configured using the Key ID and Key Secret from environment variables.
 */
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;
