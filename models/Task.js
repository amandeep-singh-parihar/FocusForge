import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
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
		description: {
			type: String,
		},
		status: {
			type: String,
			enum: ['todo', 'in_progress', 'completed'],
			default: 'todo',
		},
		order: {
			type: Number,
			default: 0,
		},
		dueDate: Date,
	},
	{ timestamps: true },
);

export default mongoose.model('Task', taskSchema);
