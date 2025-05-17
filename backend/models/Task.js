import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'To Do' },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
