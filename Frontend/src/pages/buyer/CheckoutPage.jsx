import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiHome, FiMapPin } from 'react-icons/fi';
// import axiosInstance from '../api/axiosConfig'; // To be used when connecting to the backend

// --- Mock Data ---
const mockAddresses = [
  { id: 1, type: 'Home', line1: '123, Green Valley', line2: 'Near Central Park', city: 'Metropolis', pincode: '400001' },
  { id: 2, type: 'Work', line1: 'Tech Tower, 5th Floor', line2: 'Business Bay', city: 'Metropolis', pincode: '400025' },
];

const orderSummaryDetails = {
  subtotal: 565.00,
  discount: 113.00,
  deliveryFee: 15.00,
};


// --- Sub-Components ---

const AddressCard = ({ address, isSelected, onSelect }) => (
  <div 
    onClick={() => onSelect(address.id)}
    className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-300 dark:border-gray-600'}`}
  >
    <div className="flex items-center mb-2">
      <FiHome className="mr-2 text-green-600" />
      <h4 className="font-bold text-lg text-gray-800 dark:text-white">{address.type}</h4>
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{address.line1}, {address.line2}</p>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{address.city} - {address.pincode}</p>
  </div>
);

const AddAddressModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">Add New Address</h3>
        <form className="space-y-4">
            {/* Form fields would go here */}
            <input type="text" placeholder="Address Line 1" className="w-full p-2 border rounded-md dark:bg-gray-700"/>
            <input type="text" placeholder="City" className="w-full p-2 border rounded-md dark:bg-gray-700"/>
            <input type="text" placeholder="Pincode" className="w-full p-2 border rounded-md dark:bg-gray-700"/>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">Save Address</button>
            </div>
        </form>
      </div>
    </div>
  );
};


// --- Main CheckoutPage Component ---

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    // This function simulates the entire Razorpay payment flow.
    // In a real app, you'd use your axiosInstance to make these calls.

    try {
        // Step 1: Get Razorpay Key from your backend
        // const { data: { key } } = await axiosInstance.get('/payments/getkey');
        const key = 'YOUR_RAZORPAY_KEY_ID'; // Replace with your actual key or fetch from backend

        // Step 2: Create a payment order on your backend
        // const { data: { order } } = await axiosInstance.post('/payments/create-order', { amount: orderSummaryDetails.subtotal - orderSummaryDetails.discount + orderSummaryDetails.deliveryFee });
        const mockOrder = { id: 'order_mock_' + Date.now(), amount: (orderSummaryDetails.subtotal - orderSummaryDetails.discount + orderSummaryDetails.deliveryFee) * 100 };

        // Step 3: Set up Razorpay options
        const options = {
            key,
            amount: mockOrder.amount,
            currency: "INR",
            name: "Farm Fresh",
            description: "Test Transaction",
            image: "https://example.com/your_logo.svg",
            order_id: mockOrder.id,
            handler: function (response) {
                // Step 4: Handle the successful payment response
                console.log('Payment successful:', response);
                // Verify payment on backend
                // axiosInstance.post('/payments/verify-payment', response);
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                navigate('/order-success'); // Redirect to an order confirmation page
            },
            prefill: {
                name: "Test User",
                email: "test.user@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#34D399",
            },
        };

        // Step 5: Open the Razorpay checkout modal
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert(`Payment Failed: ${response.error.description}`);
        });
        rzp1.open();

    } catch (error) {
        console.error("Payment process failed", error);
        alert("Could not initiate payment. Please try again.");
    }
  };

  const { subtotal, discount, deliveryFee } = orderSummaryDetails;
  const total = subtotal - discount + deliveryFee;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Address Selection */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Select Delivery Address</h1>
            <div className="space-y-4">
              {addresses.map(address => (
                <AddressCard 
                  key={address.id}
                  address={address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={setSelectedAddressId}
                />
              ))}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-green-600 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FiPlus />
              Add New Address
            </button>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
             <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                    <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
                <button onClick={handlePayment} className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                    Pay ₹{total.toFixed(2)}
                </button>
            </div>
          </div>
        </div>
      </div>
      <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CheckoutPage;
