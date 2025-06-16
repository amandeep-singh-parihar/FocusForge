import mongoose from 'mongoose';

const dailySummarySchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		totalPomodoroMinutes: {
			type: Number,
			default: 0,
		},
		tasksCompleted: {
			type: Number,
			default: 0,
		},
		goalsCompleted: {
			type: Number,
			default: 0,
		},
		notes: {
			type: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('DailySummary', dailySummarySchema);
