import express from 'express'
import {registerSeller,getAllSellers} from '../controllers/sellerController.js'
import uploadGovID from '../middleware/uploadMiddleware.js'

const router=express.Router()

router.post('/',uploadGovID,registerSeller)
router.get('/',getAllSellers)

export default router