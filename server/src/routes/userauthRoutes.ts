import express from 'express'
const router = express.Router()
import { Signup, Login , verifyOTP} from '../controllers/userauth'


router.post('/signup',Signup)

router.post('/verify-otp', verifyOTP)

router.post('/login', Login)


           
export default router ;