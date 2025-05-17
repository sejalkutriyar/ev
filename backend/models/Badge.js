import mongoose from 'mongoose';
const badgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  awardedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Badge', badgeSchema);