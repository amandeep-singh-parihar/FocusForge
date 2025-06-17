import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
	createTask,
	getUserTasks,
	updateTask,
	deleteTask,
	getKanbanTasks,
	updateTaskStatus,
} from '../controllers/taskController.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.post('/create', createTask);
router.get('/my-tasks', getUserTasks);
router.put('/update/:taskId', updateTask);
router.delete('/delete/:taskId', deleteTask);

router.get('/kanban', authenticate, getKanbanTasks);
router.patch('/:taskId/status', authenticate, updateTaskStatus);

export default router;
