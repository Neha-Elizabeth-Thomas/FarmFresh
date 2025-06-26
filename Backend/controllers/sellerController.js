import User from '../models/user.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js';

export const registerSeller = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    confirmPassword,
    role, // optional; we’ll override below anyway
    sellerProfile, // now expected as an object
  } = req.body;

  // Basic validation
  if (!name || !email || !phone || !password || !confirmPassword || !sellerProfile) {
    res.status(400);
    throw new Error('Please provide all required fields for seller registration');
  }

  const {
    storeName,
    storeDescription,
    address,
    gstNumber,
    govIDProofURL
  } = sellerProfile;

  if (!storeName || !storeDescription || !address || !gstNumber || !govIDProofURL) {
    res.status(400);
    throw new Error('Please provide all required seller profile fields');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  // Check if user already exists
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email or phone already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: ['buyer', 'seller'], // explicitly assign roles
    sellerProfile
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      sellerProfile: user.sellerProfile,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data for seller');
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


