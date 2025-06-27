import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

export const protect=asyncHandler(async (req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            const token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            req.user=await User.findById(decoded.id).select('-password')
            if(!req.user){
                res.status(400);
                throw new Error("token validation faileed");
            }
            next();            
    }else{
        res.status(400);
        throw new Error("No authorization token provided")
    }
})

export const sellerOnly=asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.role.includes('seller')){
        next();
    }else{
        res.status(400);
        throw new Error("Only seller can access this route")
    }
})


export const adminOnly=asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.role.includes('admin')){
        next();
    }else{
        res.status(400);
        throw new Error("Only admin can access this route")
    }
})
