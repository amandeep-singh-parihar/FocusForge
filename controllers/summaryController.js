import DailySummary from '../models/DailySummary.js';

export const getTodaySummary = async (req, res) => {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		let summary = await DailySummary.findOne({
			user: req.userId,
			date: today,
		});

		if (!summary) {
			summary = await DailySummary.create({
				user: req.userId,
				date: today,
			});
		}

		res.status(200).json({
			success: true,
			data: summary,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch summary',
			error: error.message,
		});
	}
};

export const updateTodaySummary = async (req, res) => {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const { pomodoroMinutes = 0, tasksCompleted = 0, goalsCompleted = 0, notes = '' } = req.body;

		let summary = await DailySummary.findOneAndUpdate(
			{ user: req.userId, date: today },
			{
				$inc: {
					totalPomodoroMinutes: pomodoroMinutes,
					tasksCompleted,
					goalsCompleted,
				},
				$set: { notes },
			},
			{ new: true, upsert: true }
		);

		res.status(200).json({
			success: true,
			message: 'Summary updated',
			data: summary,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error updating summary',
			error: error.message,
		});
	}
};
