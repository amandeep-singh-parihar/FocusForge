import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
	getTodaySummary,
	updateTodaySummary,
} from '../controllers/summaryController.js';

const router = express.Router();

router.get('/today', authenticate, getTodaySummary);
router.put('/update', authenticate, updateTodaySummary);

export default router;
