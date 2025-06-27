import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: { type: String, trim: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// To prevent a user from reviewing the same product multiple times
reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
