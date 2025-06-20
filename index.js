import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { DBconnect } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import pomodoroRoutes from './routes/pomodoroRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// DB Connection
DBconnect();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/pomodoro', pomodoroRoutes);
app.use('/api/v1/summary', summaryRoutes);

// Server Start
app.listen(PORT, () => {
	console.log('App is running at PORT:', PORT);
});
