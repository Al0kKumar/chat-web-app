import express from 'express'
const router = express.Router()
import { Signup, Login , verifyOTP, userDetails,recipentdetails,googleAuth,resendOtp,completeGoogleProfile } from '../controllers/userauth'
import auth from '../middlewares/authmiddleware'
import { uploadProfilePic, removeProfilePic } from '../controllers/user.profile'
import { uploadProfileImage } from '../middlewares/uploadMiddleware'

router.post('/signup',Signup)

router.post('/verify-otp', verifyOTP)

router.post('/login', Login)

router.post("/resend-otp", resendOtp);

router.post("/auth/google", googleAuth);

router.post("/auth/google/complete-profile", completeGoogleProfile);

router.get('/recipentdetails', auth, recipentdetails )

router.get('/userDetails', auth, userDetails)

router.post('/upload-profile-pic',auth, uploadProfileImage,  uploadProfilePic);

router.delete('/remove-profile-pic',auth, removeProfilePic )

           
export default router ;