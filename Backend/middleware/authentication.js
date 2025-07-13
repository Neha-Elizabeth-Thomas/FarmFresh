import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ First, try to get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // ✅ Then, fallback to token from cookie (e.g., 'token' or 'jwt')
  if (!token && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('No token found');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Token verification failed');
    }

    next();
  } catch (error) {
    console.error(error);
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
