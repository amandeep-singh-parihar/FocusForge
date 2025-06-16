import Goal from '../models/Goal.js';

// create a new goal
export const createGoal = async (req, res) => {
	try {
		const { title, targetDate } = req.body;

		const newGoal = await Goal.create({
			user: req.userId,
			title,
			targetDate,
		});

		return res.status(201).json({
			success: true,
			message: 'Goal created successfully',
			data: newGoal,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to create goal',
			error: error.message,
		});
	}
};

// get all goals for the logged-in user
export const getUserGoals = async (req, res) => {
	try {
		const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: goals,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch goals',
			error: error.message,
		});
	}
};

// update a specific goal
export const updateGoal = async (req, res) => {
	try {
		const { goalId } = req.params;
		const updates = req.body;

		const updatedGoal = await Goal.findOneAndUpdate(
			{ _id: goalId, user: req.userId },
			updates,
			{ new: true },
		);

		if (!updatedGoal) {
			return res.status(404).json({
				success: false,
				message: 'Goal not found or unauthorized',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Goal updated',
			data: updatedGoal,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to update goal',
			error: error.message,
		});
	}
};

// delete a specific goal
export const deleteGoal = async (req, res) => {
	try {
		const { goalId } = req.params;

		const deletedGoal = await Goal.findOneAndDelete({
			_id: goalId,
			user: req.userId,
		});

		if (!deletedGoal) {
			return res.status(404).json({
				success: false,
				message: 'Goal not found or unauthorized',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Goal deleted',
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to delete goal',
			error: error.message,
		});
	}
};
