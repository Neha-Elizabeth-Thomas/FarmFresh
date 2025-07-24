import express from 'express'
import userRoutes from './userRoutes.js'
import sellerRoutes from './sellerRoutes.js'
import adminRoutes from './adminRoutes.js'
import orderRoutes from './orderRoutes.js'
import cartRoutes from './cartRoutes.js'
import productRoutes from './productRoutes.js'
import paymentRoutes from './paymentRoutes.js'

const router=express.Router()

router.use('/user',userRoutes)
router.use('/seller',sellerRoutes)
router.use('/admin',adminRoutes)
router.use('/orders',orderRoutes)
router.use('/cart',cartRoutes)
router.use('/products',productRoutes)
router.use('/payments',paymentRoutes)

export default router