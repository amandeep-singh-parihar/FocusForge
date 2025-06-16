import express from 'express';
import {
	createGoal,
	getUserGoals,
	updateGoal,
	deleteGoal,
} from '../controllers/goalController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// protect routes
router.post('/create', authenticate, createGoal);
router.get('/', authenticate, getUserGoals);
router.put('/:goalId', authenticate, updateGoal);
router.delete('/:goalId', authenticate, deleteGoal);

export default router;
