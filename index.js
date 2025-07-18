import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { DBconnect } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import pomodoroRoutes from './routes/pomodoroRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: 'Too many requests, please try again after 15 minutes.',
});
app.use(limiter);

const allowedOrigins = [
	'http://localhost:3000',
	'https://focus-forge-teal.vercel.app',
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	}),
);

// Middleware
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

// Default route
app.get('/', (req, res) => {
	return res.json({
		success: true,
		message: 'Your server is up and running',
	});
});

// Start server
app.listen(PORT, () => {
	console.log('App is running at PORT:', PORT);
});
