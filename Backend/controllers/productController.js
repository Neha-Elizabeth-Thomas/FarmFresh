import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';

/*==========================================
=            PUBLIC CONTROLLERS            =
==========================================*/

// @desc    Get all products with filters, search & pagination
// @route   GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { product_name: { $regex: req.query.search, $options: 'i' } }
    : {};

  const filter = {
    ...keyword,
    is_active: true
  };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get a product by ID
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryName
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const categoryName = req.params.categoryName;

  const products = await Product.find({ category: categoryName, is_active: true });

  res.json(products);
});

// @desc    Get top-rated products
// @route   GET /api/products/top
export const getTopRatedProducts = asyncHandler(async (req, res) => {
  const reviews = await Review.aggregate([
    {
      $group: {
        _id: "$product_id",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    },
    { $sort: { averageRating: -1, totalReviews: -1 } },
    { $limit: 5 }
  ]);

  const topProducts = await Product.find({ _id: { $in: reviews.map(r => r._id) } });

  res.json(topProducts);
});

/*===============================================
=            SELLER PRODUCT MANAGEMENT          =
===============================================*/

// @desc    Create a product
// @route   POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const {
    product_name,
    description,
    category,
    price,
    quantity
  } = req.body;

  const imageUrls = req.files.map(file => file.path); // from multer-cloudinary or similar

  const product = new Product({
    seller_id: req.user._id,
    product_name,
    description,
    category,
    price,
    quantity,
    product_image: imageUrls, // From Cloudinary if using multer + Cloudinary
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Allow update only if current seller owns the product
  if (product.seller_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  product.product_name = req.body.product_name || product.product_name;
  product.description = req.body.description || product.description;
  product.category = req.body.category || product.category;
  product.price = req.body.price || product.price;
  product.quantity = req.body.quantity || product.quantity;
  if (req.file?.path) {
    product.product_image = req.file.path;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
});

/*==========================================
=            PRODUCT REVIEW (BUYER)        =
==========================================*/

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existingReview = await Review.findOne({
    product_id: productId,
    user_id: req.user._id
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = new Review({
    product_id: productId,
    user_id: req.user._id,
    rating,
    comment
  });

  await review.save();
  res.status(201).json({ message: 'Review submitted successfully' });
});
