import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiLoader } from 'react-icons/fi';
import axiosInstance from '../../api/axiosConfig';
import { useCart } from '../../context/CartContext';
import { useSelector } from 'react-redux';

const AddressCard = ({ address, isSelected, onSelect, index }) => (
  <div 
    onClick={() => onSelect(index)} // Pass the index on select
    className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-300 dark:border-gray-600'}`}
  >
    <h4 className="font-bold text-lg text-gray-800 dark:text-white">{address.type || 'Address'}</h4>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{address.house}, {address.street}</p>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{address.city} - {address.pincode}</p>
  </div>
);

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // State now holds the index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/user/profile');
        const userAddresses = data.deliveryAddress || [];
        setAddresses(userAddresses);
        
        const defaultAddressIndex = userAddresses.findIndex(a => a.isDefault);
        setSelectedAddressIndex(defaultAddressIndex !== -1 ? defaultAddressIndex : 0);

      } catch (err) {
        setError('Could not fetch your addresses.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.20;
  const deliveryFee = 15.00;
  const totalAmount = subtotal - discount + deliveryFee;

  const handlePayment = async () => {
    if (selectedAddressIndex === null || addresses[selectedAddressIndex] === undefined) {
      alert('Please select a delivery address.');
      return;
    }
    setIsProcessingPayment(true);
    const selectedAddress = addresses[selectedAddressIndex];

    // FIX: Transform the cart data to match the backend's expected format
    const orderItems = cartItems.map(item => ({
      product_id: item._id,
      quantity: item.quantity,
    }));

    try {
      // Step 1: Create the order(s) in the database
      const { data: orderResponse } = await axiosInstance.post('/orders', {
        items: orderItems,
        shippingAddress: selectedAddress,
      });

      // Assuming a single order for payment simplicity, but the backend supports multiple
      const primaryOrder = orderResponse.orders[0]; 
      const finalTotalAmount = orderResponse.totalAmount;

      // Step 2: Create Razorpay order
      const { data: { key } } = await axiosInstance.get('/payments/getkey');
      const { data: razorpayOrder } = await axiosInstance.post('/payments/create-order', {
        amount: parseFloat(finalTotalAmount), // Use the total from the backend
        receipt: primaryOrder._id,
      });

      // Step 3: Open Razorpay Checkout
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Farm Fresh",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          await axiosInstance.post('/payments/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderIds: orderResponse.orders.map(o => o._id), // Pass all created order IDs
          });
          clearCart();
          navigate('/order-success');
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#34D399" },
        modal: {
            ondismiss: function() {
                setIsProcessingPayment(false); // Reset loading state if user closes modal
            }
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', (response) => {
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessingPayment(false); // Reset loading state on failure
      });
      rzp1.open();

    } catch (err) {
      console.error("Checkout process failed", err);
      alert(err.response?.data?.message || "An error occurred during checkout.");
      setIsProcessingPayment(false); 
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl" /></div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Select Delivery Address</h1>
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <AddressCard 
                key={index}
                address={address} 
                isSelected={selectedAddressIndex === index} 
                onSelect={setSelectedAddressIndex}
                index={index}
              />
            ))}
          </div>
          <button className="mt-6 flex items-center gap-2 text-green-600"><FiPlus /> Add New Address</button>
        </div>
        <div className="lg:col-span-1">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
              <div className="border-t my-4 dark:border-gray-700"></div>
              <div className="flex justify-between text-xl font-bold"><span>Total</span><span>₹{totalAmount.toFixed(2)}</span></div>
            </div>
            <button 
              onClick={handlePayment} 
              disabled={isProcessingPayment}
              className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
