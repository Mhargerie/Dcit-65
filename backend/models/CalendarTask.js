import mongoose from 'mongoose';

const CalendarTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  notes: { type: String, default: '' },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CalendarTask', CalendarTaskSchema);
