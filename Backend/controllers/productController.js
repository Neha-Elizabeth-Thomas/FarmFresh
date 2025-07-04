import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';

/*==========================================
=            PUBLIC CONTROLLERS            =
==========================================*/
 
// @desc    Get all products with advanced filters, search, sort & pagination
// @route   GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  // --- Pagination ---
  const pageSize = Number(req.query.limit) || 12; // Default to 12 products per page
  const page = Number(req.query.page) || 1;

  // --- Base Filter Object ---
  // Start with a base filter that only includes active products
  const filter = { is_active: true };

  // --- Search Filter ---
  // Add keyword search for product name to the filter if provided
  if (req.query.search) {
    filter.product_name = {
      $regex: req.query.search,
      $options: 'i', // Case-insensitive
    };
  }

  // --- Category Filter ---
  // Filter by a specific category or multiple categories
  // e.g., /api/products?category=Electronics,Books
  if (req.query.category) {
    const categories = req.query.category.split(',');
    filter.category = { $in: categories };
  }
  
  // --- Seller (Brand) Filter ---
  // Filter by one or more seller IDs
  // e.g., /api/products?seller=60d5f2a1b9b8f83e8c8b4567
  if (req.query.seller) {
    const sellers = req.query.seller.split(',');
    filter.seller_id = { $in: sellers };
  }

  // --- Price Range Filter ---
  // Filter by a minimum and/or maximum price
  // e.g., /api/products?minPrice=100&maxPrice=500
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = parseFloat(req.query.maxPrice);
    }
  }
  
  // --- Rating Filter ---
  // This is a more complex filter. We first find products that have an average rating
  // greater than or equal to the specified value.
  if (req.query.rating) {
      const minRating = Number(req.query.rating);
      
      // 1. Find all reviews and group them by product_id to calculate average rating
      const productRatings = await Review.aggregate([
          { $group: { _id: "$product_id", avgRating: { $avg: "$rating" } } },
          { $match: { avgRating: { $gte: minRating } } }
      ]);
      
      // 2. Get the IDs of the products that match the rating criteria
      const productIds = productRatings.map(r => r._id);
      
      // 3. Add this to our main filter. If productIds is empty, nothing will match.
      filter._id = { $in: productIds };
  }

  // --- Sorting ---
  let sortOptions = {};
  const sortBy = req.query.sort || 'latest'; // Default sort by latest
  
  switch(sortBy) {
      case 'price-asc':
          sortOptions = { price: 1 };
          break;
      case 'price-desc':
          sortOptions = { price: -1 };
          break;
      case 'name-asc':
          sortOptions = { product_name: 1 };
          break;
      case 'name-desc':
          sortOptions = { product_name: -1 };
          break;
      case 'latest':
      default:
          sortOptions = { created_at: -1 };
          break;
  }

  // --- Execute Query ---
  // First, count the total documents that match the final filter
  const count = await Product.countDocuments(filter);

  // Then, find the products with the filter, sort, and pagination
  const products = await Product.find(filter)
    .populate('seller_id', 'shop_name') // Populate seller's shop name
    .sort(sortOptions)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
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
  if (req.files) {
    const imageUrls = req.files.map(file => file.path); // from multer-cloudinary or similar
    product.product_image = imageUrls;
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
