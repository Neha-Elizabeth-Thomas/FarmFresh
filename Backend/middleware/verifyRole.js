import asyncHandler from 'express-async-handler'

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

