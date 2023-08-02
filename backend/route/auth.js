import expres from 'express'
import { forgetPassword, resetPassword, verifyEmail } from '../controller/auth.js';

const router = expres.Router()
router.post("/resetpassword/:token", resetPassword);
router.post('/forgetpassword', forgetPassword)
router.get("/verifyemail", verifyEmail);
export default router