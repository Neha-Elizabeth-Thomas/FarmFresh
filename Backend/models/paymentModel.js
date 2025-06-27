import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user_id: { // The buyer
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller_id: { // The seller
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  platform_fee: { type: mongoose.Schema.Types.Decimal128, required: true },
  seller_receives: { type: mongoose.Schema.Types.Decimal128, required: true },
  payment_status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  payment_method: { type: String, required: true },
  transaction_id: { type: String }, // From the payment gateway
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Helper to convert Decimal128 to a string for JSON responses
paymentSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) ret.amount = ret.amount.toString();
    if (ret.platform_fee) ret.platform_fee = ret.platform_fee.toString();
    if (ret.seller_receives) ret.seller_receives = ret.seller_receives.toString();
    return ret;
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
