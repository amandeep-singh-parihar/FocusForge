import express from 'express';
import {
	registerUser,
	loginUser,
	getUserProfile,
	sendOtp,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getUserProfile);
router.post('/sendOtp', sendOtp);

export default router;
