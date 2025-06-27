import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

/*============================================
=            GET CART ITEMS                 =
============================================*/
// @desc    Get the user's cart
// @route   GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.cart);
});


/*============================================
=            ADD ITEM TO CART               =
============================================*/
// @desc    Add a product to cart
// @route   POST /api/cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existingItem = user.cart.find(
    item => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity || 1);
  } else {
    user.cart.push({
      product: productId,
      quantity: quantity || 1,
    });
  }

  await user.save();
  res.status(201).json({ message: 'Item added to cart', cart: user.cart });
});


/*============================================
=        UPDATE ITEM QUANTITY IN CART       =
============================================*/
// @desc    Update quantity of an item in the cart
// @route   PUT /api/cart/:productId
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const user = await User.findById(req.user._id);
  const item = user.cart.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  await user.save();

  res.json({ message: 'Cart updated', cart: user.cart });
});


/*============================================
=            REMOVE ITEM FROM CART          =
============================================*/
// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    item => item.product.toString() !== productId
  );

  await user.save();
  res.json({ message: 'Item removed from cart', cart: user.cart });
});


/*============================================
=            CLEAR ENTIRE CART              =
============================================*/
// @desc    Clear user's cart
// @route   DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.json({ message: 'Cart cleared' });
});
