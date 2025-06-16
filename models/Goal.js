import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		targetDate: {
			type: Date,
		},
		status: {
			type: String,
			enum: ['not_started', 'in_progress', 'completed'],
			default: 'not_started',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('Goal', goalSchema);
