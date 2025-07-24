import express from 'express'
import {registerSeller,getAllSellers, getSellerProducts} from '../controllers/sellerController.js'
import {uploadGovID} from '../middleware/uploadMiddleware.js'
import { protect, sellerOnly ,adminOnly} from '../middleware/authentication.js';

const router=express.Router()

router.post('/register',uploadGovID,registerSeller)
router.get('/',getAllSellers)
router.get('/products', protect, sellerOnly, getSellerProducts);

export default router