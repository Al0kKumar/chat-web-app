import express from 'express'
const router = express.Router()
import { Signup, Login , verifyOTP, userDetails,recipentdetails,googleAuth,resendOtp,completeGoogleProfile } from '../controllers/userauth'
import auth from '../middlewares/authmiddleware'

router.post('/signup',Signup)

router.post('/verify-otp', verifyOTP)

router.post('/login', Login)

router.post("/resend-otp", resendOtp);

router.post("/auth/google", googleAuth);

router.post("/auth/google/complete-profile", completeGoogleProfile);

router.get('/recipentdetails', auth, recipentdetails )

router.get('/userDetails', auth, userDetails)

           
export default router ;