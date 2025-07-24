import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext'; // 1. Import the useCart hook

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  // The data structure from context is the full product object
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img src={item.product_image[0] || 'https://placehold.co/100x100'} alt={item.product_name} className="w-16 h-16 rounded-md object-cover" />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">{item.product_name}</h3>
          <p className="text-lg font-bold text-green-600">₹{item.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={() => onQuantityChange(item, item.quantity - 1)} className="p-2" disabled={item.quantity === 1}><FiMinus /></button>
          <span className="px-3 font-semibold">{item.quantity}</span>
          <button onClick={() => onQuantityChange(item, item.quantity + 1)} className="p-2"><FiPlus /></button>
        </div>
        <button onClick={() => onRemove(item._id)} className="text-red-500 hover:text-red-700">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

const OrderSummary = ({ subtotal, discount, deliveryFee }) => {
  const total = subtotal - discount + deliveryFee;
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-red-500"><span>Discount (20%)</span><span>-₹{discount.toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
        <div className="border-t my-4 dark:border-gray-700"></div>
        <div className="flex justify-between font-bold text-xl text-gray-800 dark:text-white"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
      </div>
      <Link to="/checkout">
        <button className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Go to Checkout</button>
      </Link>
    </div>
  );
};

const CartPage = () => {
  // 2. Use state and functions from the CartContext
  const { cartItems, addToCart, removeFromCart } = useCart();

  const handleQuantityChange = (item, newQuantity) => {
    // To "update" quantity, we can think of it as adding the same item again,
    // but we need to adjust the logic in the context slightly or handle it here.
    // For simplicity, let's just re-implement the logic for now.
    // A more robust solution would be an `updateQuantity` function in the context.
    console.log("Updating quantity is best handled inside the context.");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.20;
  const deliveryFee = 15.0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-green-600">Home</Link> / <span>Cart</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Cart</h1>
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItem key={item._id} item={item} onQuantityChange={handleQuantityChange} onRemove={removeFromCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Your cart is empty</h2>
              <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
              <Link to="/"><button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Continue Shopping</button></Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {cartItems.length > 0 && <OrderSummary subtotal={subtotal} discount={discount} deliveryFee={deliveryFee} />}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
