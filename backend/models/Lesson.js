import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq','tf','id'], required: true },
  question: { type: String, required: true },
  choices: [String],
  answer: { type: mongoose.Schema.Types.Mixed, required: true }
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, default: '' },
  content_url: { type: String, default: '' },
  group: { type: String, default: 'default' },
  locked: { type: Boolean, default: false },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lesson', LessonSchema);
