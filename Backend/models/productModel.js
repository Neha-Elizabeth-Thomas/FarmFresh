import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product_name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  quantity: { type: Number, required: true, default: 0 },
  product_image: { type: [String], required: true }, // URL to the image
  is_active: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Helper to convert Decimal128 to a string for JSON responses
productSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    if (ret.price) {
      ret.price = ret.price.toString();
    }
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
