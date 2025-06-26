import express from 'express'
import protect from '../middleware/authentication.js'
import {register,login,logout,getUserById,updateProfile,forgotPassword,resetPassword} from '../controllers/userController.js'

const router=express.Router() 

router.post('/',register)
router.post('/login',login)
router.post('/logout',logout)

router.get('/:id',getUserById)
router.put('/profile',protect,updateProfile)

router.post('/forgotpassword',forgotPassword);
router.put('/resetpassword/:token',resetPassword);
export default router