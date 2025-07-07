import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiTag } from 'react-icons/fi';

// --- Mock Data ---
const initialCartItems = [
  { id: 1, name: 'Mango Pickle', price: 145, quantity: 1, image: 'https://placehold.co/100x100/f0f0f0/333?text=Item' },
  { id: 2, name: 'Home made chocolates', price: 180, quantity: 1, image: 'https://placehold.co/100x100/f0f0f0/333?text=Item' },
  { id: 3, name: 'Kuzhalappam', price: 240, quantity: 1, image: 'https://placehold.co/100x100/f0f0f0/333?text=Item' },
];

// --- Sub-Components ---

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
          <p className="text-lg font-bold text-green-600">₹{item.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={() => onQuantityChange(item.id, item.quantity - 1)} className="p-2 disabled:opacity-50" disabled={item.quantity === 1}><FiMinus size={16} /></button>
          <span className="px-3 font-semibold">{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.id, item.quantity + 1)} className="p-2"><FiPlus size={16} /></button>
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const OrderSummary = ({ subtotal, discount, deliveryFee }) => {
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount (-20%)</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
        <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      <div className="relative mt-6">
        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Add promo code"
          className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-900">
          Apply
        </button>
      </div>
      <Link to="/checkout">
        <button className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
          Go to Checkout
        </button>
      </Link>
    </div>
  );
};


// --- Main CartPage Component ---

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.20; // 20% discount
  const deliveryFee = 15.00;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">/</span>
        <span>Cart</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Cart</h1>
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Your cart is empty</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/">
                    <button className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                        Continue Shopping
                    </button>
                </Link>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary 
            subtotal={subtotal}
            discount={discount}
            deliveryFee={deliveryFee}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
