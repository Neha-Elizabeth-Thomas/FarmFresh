// controllers/userController.js
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Register a new seller (buyer + seller role)
// @route   POST /api/users/register-seller
// @access  Public
export const registerSeller = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    confirmPassword,
    storeName,
    storeDescription,
    gstNumber,
    address, // address should be an object
    bankDetails, // optional
    deliveryAreas, // optional array
  } = req.body;

  // Basic field validation
  if (!name || !email || !phone || !password || !confirmPassword || !storeName || !storeDescription || !gstNumber || !address) {
    res.status(400);
    throw new Error('All required seller fields must be filled');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  // File upload validation (req.file from multer)
  if (!req.file || !req.file.path) {
    res.status(400);
    throw new Error('Government ID proof must be uploaded');
  }

  const govIDProofURL = req.file.path; // Cloudinary URL

  // Check for existing user
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email or phone already exists');
  }

  // Convert stringified fields to actual objects if necessary
  const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
  const parsedBankDetails = typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails;

  // Create user with nested sellerProfile
  const user = await User.create({
  name,
  email,
  phone,
  password,
  role: 'seller',
  sellerProfile: {
    storeName,
    storeDescription,
    gstNumber,
    govIDProofURL,
    address: parsedAddress, 
    bankDetails: parsedBankDetails,
    deliveryAreas,
    isVerified: false
  }
});


  if (user) {
    res.status(201).json({
      message:"seller successfully registered",
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      sellerProfile: user.sellerProfile,
    });
  } else {
    res.status(400);
    throw new Error('Seller registration failed');
  }
});



export const getAllSellers=asyncHandler(async (req,res)=>{
    const sellers=await User.find({role:'seller'}).select("-password");
    if(!sellers){
        res.status(400);
        throw new Error("Error in getting all sellers");
    }else{
        res.status(200).json(sellers)
    }
})


