import mongoose from 'mongoose';

const pomodoroSessionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['work', 'short_break', 'long_break'],
			default: 'work',
		},
		duration: {
			type: Number,
			default: 25,
		},
		startedAt: {
			type: Date,
			default: Date.now,
		},
		stoppedAt: {
			type: Date,
		},
		status: {
			type: String,
			enum: ['active', 'paused', 'completed'],
			default: 'active',
		},
	},
	{ timestamps: true },
);

export default mongoose.model('PomodoroSession', pomodoroSessionSchema);
