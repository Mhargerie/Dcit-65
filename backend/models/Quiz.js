import mongoose from 'mongoose';

const QuizQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq','tf','id'], required: true },
  question: { type: String, required: true },
  choices: [String],
  answer: { type: mongoose.Schema.Types.Mixed, required: true }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  questions: [QuizQuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', QuizSchema);
