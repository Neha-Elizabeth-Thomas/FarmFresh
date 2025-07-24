import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

// Your updated authentication.js
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt; // Get token directly from the cookie

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export const sellerOnly=asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.role === 'seller'){
        next();
    }else{
        res.status(400);
        throw new Error("Only seller can access this route")
    }
})


export const adminOnly=asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(400);
        throw new Error("Only admin can access this route")
    }
})
