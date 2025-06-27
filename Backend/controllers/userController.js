import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js';

export const registerBuyer=asyncHandler(async (req,res)=>{
    const {name,email,phone,password,confirmPassword}=req.body; 

    if(!name || !email || !phone || !password ||!confirmPassword){
        res.status(400)
        throw new Error("Please provide all the required fields before submitting")
    }

    if(password!==confirmPassword){
        res.status(400);
        throw new Error("Passwords do not match");
    }

    const userExists=await User.findOne({$or:[{email},{phone}]});
    if(userExists){
        res.status(400);
        throw new Error("A User with the same email or phone no already exists")
    }

    const user=await User.create({
        name,
        email,
        phone,
        password
    });

    if(user){
        res.status(200).json({
            message:"Buyer registered successfully",
            id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone
        })
    }else{
        res.status(400)
        throw new Error("Ivalid user data given")
    }
})


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid Email");
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      deliveryAddress: user.deliveryAddress,
      sellerProfile: user.sellerProfile,
    });
  } else {
    res.status(401);
    throw new Error("Password mismatch");
  }
});


export const getUserById=asyncHandler(async (req,res)=>{
    const user=await User.findById(req.params.id).select('-password');
    if(!user){
        res.status(401);
        throw new Error("User not found");
    }else{
        res.status(200).json(user);
    }
})

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});


export const updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user by the ID from the token
  const user = await User.findById(req.user._id);

  if (user) {
    // Update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // Update password if it was provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Update delivery address if provided
    if (req.body.deliveryAddress) {
      user.deliveryAddress = req.body.deliveryAddress;
    }

    // If the user is a seller, update seller profile fields
    if (user.role.includes('seller') && req.body.sellerProfile) {
      const { storeName, storeDescription, address, deliveryAreas, gstNumber, bankDetails } = req.body.sellerProfile;

      if (storeName) user.sellerProfile.storeName = storeName;
      if (storeDescription) user.sellerProfile.storeDescription = storeDescription;
      if (gstNumber) user.sellerProfile.gstNumber = gstNumber;
      if (address) user.sellerProfile.address = address; // optionally deep merge
      if (deliveryAreas) user.sellerProfile.deliveryAreas = deliveryAreas;
      if (bankDetails) user.sellerProfile.bankDetails = bankDetails;
    }


    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  // 1. Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    // For security, don't reveal that the user does not exist
    // Just send a generic success message
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    return;
  }

  // 2. Get the unhashed reset token from the user model method
  const resetToken = user.getResetPasswordToken();

  // 3. Save the user document with the new hashed token and expiry
  await user.save({ validateBeforeSave: false }); // Bypass validation for this save

  // 4. Create the reset URL for the email
  // This URL points to your front-end application's reset password page
  const resetUrl = `${req.protocol}://${req.get('host')}/api/user/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\nIf you did not request this, please ignore this email. This link is valid for 15 minutes.`;

  try {
    // 5. Send the email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Token',
      message: message,
      isHtml:false
    });

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (err) {
    console.error(err);
    // If email fails, clear the token from the database to allow a retry
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }
});

// @desc    Reset password
// @route   PUT /api/users/resetpassword/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  // 1. Get the unhashed token from the URL params
  const resetToken = req.params.token;
  const { password, confirmPassword } = req.body;
  
  if (!password || !confirmPassword) {
    res.status(400);
    throw new Error('Please provide a new password and confirm it.');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match.');
  }

  // 2. Hash the token to match the one stored in the DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Find the user by the hashed token and check if it's not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Check if expiry is in the future
  });
  
  if (!user) {
    res.status(400);
    throw new Error('Token is invalid or has expired.');
  }

  // 4. Set the new password
  user.password = password;
  // Clear the token fields on the user document
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 5. Save the updated user document (this will trigger the pre-save hook to hash the new password)
  await user.save();

  res.status(200).json({
    message: 'Password has been reset successfully.',
  });
});

// @desc    Add or update a delivery address
// @route   PUT /api/users/address
// @access  Private
export const updateUserAddress = asyncHandler(async (req, res) => {
  const { address, isDefault } = req.body;

  if (!address || typeof address !== 'object') {
    res.status(400);
    throw new Error('Invalid address data');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Optional: If isDefault is true, reset other addresses' isDefault
  if (isDefault) {
    user.deliveryAddress.forEach(addr => (addr.isDefault = false));
    address.isDefault = true;
  }

  // Push new address (no _id needed as we use array of subdocs with no _id)
  user.deliveryAddress.push(address);

  await user.save();
  res.status(200).json({ message: 'Address added', addresses: user.deliveryAddress });
});


// @desc    Delete a delivery address by index
// @route   DELETE /api/users/address/:addressId
// @access  Private
export const deleteUserAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const index = parseInt(addressId);
  if (isNaN(index) || index < 0 || index >= user.deliveryAddress.length) {
    res.status(400);
    throw new Error('Invalid address index');
  }

  user.deliveryAddress.splice(index, 1);
  await user.save();

  res.status(200).json({ message: 'Address deleted', addresses: user.deliveryAddress });
});

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

export const checkUserStatus = asyncHandler(async (req, res) => {
  // req.user._id is set by your `protect` middleware (from token)
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  // If user is a seller, add seller verification status
  if (user.role.includes('seller')) {
    response.sellerStatus = {
      isVerified: user.sellerProfile?.isVerified || false,
      verifiedAt: user.sellerProfile?.verifiedAt || null,
    };
  }

  res.status(200).json(response);
});

