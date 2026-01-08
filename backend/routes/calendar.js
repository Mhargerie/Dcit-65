import express from 'express';
import CalendarTask from '../models/CalendarTask.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get tasks in a date range (inclusive)
router.get('/', requireAuth, async (req, res) => {
  try {
    // expects ?start=YYYY-MM-DD&end=YYYY-MM-DD
    const { start, end } = req.query;
    const s = start ? new Date(start) : new Date();
    const e = end ? new Date(end) : new Date();
    const tasks = await CalendarTask.find({ user: req.userId, date: { $gte: s, $lte: e } }).sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task (only future dates)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, notes, date } = req.body;
    const d = new Date(date);
    const now = new Date();
    // allow tasks on today and future
    if (d < new Date(now.toDateString())) return res.status(400).json({ msg: 'Cannot create tasks in the past' });
    const task = await CalendarTask.create({ user: req.userId, title, notes, date: d });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit task
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const task = await CalendarTask.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (String(task.user) !== String(req.userId)) return res.status(403).json({ msg: 'Forbidden' });
    const { title, notes, date } = req.body;
    if (date) task.date = new Date(date);
    if (title) task.title = title;
    if (notes) task.notes = notes;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const task = await CalendarTask.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (String(task.user) !== String(req.userId)) return res.status(403).json({ msg: 'Forbidden' });
    await task.remove();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
