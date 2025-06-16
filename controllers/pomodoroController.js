import PomodoroSession from '../models/PomodoroSession.js';

export const startPomodoro = async (req, res) => {
	try {
		const { type = 'work', duration = 25 } = req.body;

		const session = await PomodoroSession.create({
			user: req.userId,
			type,
			duration,
		});

		return res.status(201).json({
			success: true,
			message: 'Pomodoro session started',
			data: session,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to start session',
			error: error.message,
		});
	}
};

export const updatePomodoroStatus = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const { status } = req.body;

		const session = await PomodoroSession.findOneAndUpdate(
			{ _id: sessionId, user: req.userId },
			{
				status,
				stoppedAt:
					status === 'completed' || status === 'paused' ? new Date() : null,
			},
			{ new: true },
		);

		if (!session) {
			return res
				.status(404)
				.json({ success: false, message: 'Session not found' });
		}

		return res.status(200).json({
			success: true,
			data: session,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to update session',
			error: error.message,
		});
	}
};

export const getUserPomodoroSessions = async (req, res) => {
	try {
		const sessions = await PomodoroSession.find({ user: req.userId }).sort({
			createdAt: -1,
		});

		return res.status(200).json({
			success: true,
			data: sessions,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch sessions',
			error: error.message,
		});
	}
};
