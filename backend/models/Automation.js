import mongoose from 'mongoose';

const automationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  trigger: { type: String, required: true }, 
  condition: { type: Object, required: true }, 
  action: { type: String, required: true }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parameters: { type: mongoose.Schema.Types.Mixed},
}, {timestamps: true});


const Automation = mongoose.model('Automation', automationSchema);

export default Automation;