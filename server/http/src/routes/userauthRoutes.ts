import express from 'express'
const router = express.Router()
import { Signup, Login , verifyOTP, userDetails} from '../controllers/userauth'
import auth from '../middlewares/authmiddleware'


router.post('/signup',Signup)

router.post('/verify-otp', verifyOTP)

router.post('/login', Login)

router.get('/userDetails', auth, userDetails)

           
export default router ;