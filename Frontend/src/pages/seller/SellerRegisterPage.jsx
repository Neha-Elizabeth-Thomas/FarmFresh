import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import axiosInstance from '../../api/axiosConfig';

const Stepper = ({ currentStep }) => {
  const steps = ['Account Info', 'Store Details', 'Documents & Bank'];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index + 1 <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {index + 1}
            </div>
            <p className={`mt-2 text-sm ${index + 1 <= currentStep ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>{step}</p>
          </div>
          {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};


const SellerRegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeDescription: '',
    gstNumber: '',
    address: {
      house: '',
      street: '',
      city: '',
      postOffice: '',
      district: '',
    },
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
    },
    govIDProof: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };
  
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, [name]: value } }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, govIDProof: e.target.files[0] }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    // Create a FormData object to send multipart data (including the file)
    const submissionData = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
        if (key === 'govIDProof') return;
        if (typeof formData[key] === 'object' && formData[key] !== null) {
            submissionData.append(key, JSON.stringify(formData[key]));
        } else {
            submissionData.append(key, formData[key]);
        }
    });

    // Append the file
    if (formData.govIDProof) {
        submissionData.append('govIDProof', formData.govIDProof);
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/seller/register', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error('Seller registration failed:', err);
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    }finally {
      setLoading(false);
    }

  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Account Information</h3>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Store Details</h3>
            <input type="text" name="storeName" placeholder="Store Name" value={formData.storeName} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <textarea name="storeDescription" placeholder="Store Description" value={formData.storeDescription} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="gstNumber" placeholder="GST Number" value={formData.gstNumber} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <h4 className="font-medium pt-2">Store Address</h4>
            <input type="text" name="house" placeholder="House/Building No." value={formData.address.house} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="street" placeholder="Street" value={formData.address.street} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="district" placeholder="District" value={formData.address.district} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="postOffice" placeholder="Post Office" value={formData.address.postOffice} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" required />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Documents & Bank Details</h3>
            <div>
              <label className="block mb-2 text-sm font-medium">Government ID Proof (PDF, JPG, PNG)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">{formData.govIDProof ? formData.govIDProof.name : <><span className="font-semibold">Click to upload</span> or drag and drop</>}</p>
                  </div>
                  <input type="file" name="govIDProof" onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" required />
                </label>
              </div>
            </div>
            <h4 className="font-medium pt-2">Bank Details (Optional)</h4>
            <input type="text" name="accountNumber" placeholder="Account Number" value={formData.bankDetails.accountNumber} onChange={handleBankChange} className="w-full p-3 border rounded-lg" />
            <input type="text" name="ifscCode" placeholder="IFSC Code" value={formData.bankDetails.ifscCode} onChange={handleBankChange} className="w-full p-3 border rounded-lg" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">Become a Seller</h2>
        <Stepper currentStep={step} />
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="flex justify-between mt-8">
            {step > 1 && <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg"><FiArrowLeft /> Back</button>}
            <div className="flex-1"></div> {/* Spacer */}
            {step < 3 && <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg">Next <FiArrowRight /></button>}
            {step === 3 && <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold">{loading ? 'Registering as Seller...' : 'Register as Seller'}</button>}
          </div>
        </form>
        <p className="text-center text-sm mt-6">Already have an account? <Link to="/login" className="text-green-600 font-semibold">Login</Link></p>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
