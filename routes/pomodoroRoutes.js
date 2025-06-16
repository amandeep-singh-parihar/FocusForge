import express from 'express';
import {
	startPomodoro,
	updatePomodoroStatus,
	getUserPomodoroSessions,
} from '../controllers/pomodoroController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/start', authenticate, startPomodoro);
router.put('/update/:sessionId', authenticate, updatePomodoroStatus);
router.get('/', authenticate, getUserPomodoroSessions);

export default router;
