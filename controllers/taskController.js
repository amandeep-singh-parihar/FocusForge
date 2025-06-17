import Task from '../models/Task.js';

// create a task
export const createTask = async (req, res) => {
	try {
		const { title, description, dueDate } = req.body;

		// verify
		if (!title || !description || !dueDate) {
			return res.status(400).json({
				success: false,
				message: 'All fields are required',
			});
		}

		const task = await Task.create({
			title,
			description,
			dueDate,
			user: req.userId,
		});

		return res.status(201).json({
			success: true,
			task,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to create task',
			error: error.message,
		});
	}
};

// get all tasks for a user
export const getUserTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });

		if (!tasks) {
			return res.status(400).json({
				success: false,
				message: 'No Tasks !!!',
			});
		}

		return res.status(200).json({
			success: true,
			tasks,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch tasks',
			error: error.message,
		});
	}
};

// update a task
export const updateTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		if (!taskId) {
			return res.status(400).json({
				success: false,
				message: 'TaskId required!',
			});
		}
		const updates = req.body;

		if (!updates) {
			return res.status(400).json({
				success: false,
				message: 'Please provide atleast one update',
			});
		}

		const task = await Task.findOneAndUpdate(
			{ _id: taskId, user: req.userId },
			updates,
			{ new: true },
		);

		if (!task) {
			return res.status(404).json({
				success: false,
				message: 'Task not found',
			});
		}

		return res.status(200).json({
			success: true,
			task,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to update task',
			error: error.message,
		});
	}
};

// delete a task
export const deleteTask = async (req, res) => {
	try {
		const { taskId } = req.params;

		if (!taskId) {
			return res.status(400).json({
				success: false,
				message: 'TaskId required',
			});
		}

		const task = await Task.findOneAndDelete({ _id: taskId, user: req.userId });

		if (!task) {
			return res.status(404).json({
				success: false,
				message: 'Task not found',
			});
		}

		return res.status(200).json({ success: true, message: 'Task deleted' });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to delete task',
			error: error.message,
		});
	}
};

export const getKanbanTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ user: req.userId }).sort({ order: 1 });

		const grouped = {
			todo: [],
			in_progress: [],
			completed: [],
		};

		tasks.forEach((task) => {
			grouped[task.status].push(task);
		});

		res.status(200).json({ success: true, data: grouped });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching Kanban tasks',
			error: error.message,
		});
	}
};

export const updateTaskStatus = async (req, res) => {
	const { taskId } = req.params;
	const { status, order } = req.body;

	try {
		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{ status, order },
			{ new: true },
		);

		res.status(200).json({ success: true, data: updatedTask });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Could not update task',
			error: error.message,
		});
	}
};
