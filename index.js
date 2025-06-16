import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { DBconnect } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
DBconnect();

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Server Start
app.listen(PORT, () => {
	console.log('App is running at PORT:', PORT);
});
