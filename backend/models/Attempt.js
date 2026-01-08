import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: { type: Object, default: {} },
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

export default mongoose.model('Attempt', AttemptSchema);
