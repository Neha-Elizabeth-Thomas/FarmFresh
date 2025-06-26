import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import asyncHandler from 'express-async-handler'

const protect=asyncHandler(async (req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            const token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            req.user=await User.findOne(decoded.id).select('-password')
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

export default protect;