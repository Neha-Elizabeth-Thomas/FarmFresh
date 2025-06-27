import mongoose from 'mongoose';

// Schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true }, // Price at the time of order
}, { _id: false });


const orderSchema = new mongoose.Schema({
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
  items: [orderItemSchema],
  total_amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: { // Denormalized address for historical record
    address: String,
    city: String,
    pincode: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Helper to convert Decimal128 to a string for JSON responses
orderSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    if (ret.total_amount) {
      ret.total_amount = ret.total_amount.toString();
    }
    if (ret.items) {
      ret.items.forEach(item => {
        if (item.price) item.price = item.price.toString();
      });
    }
    return ret;
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
