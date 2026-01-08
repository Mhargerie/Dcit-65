import express from 'express';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// List all lessons (for now, return unlocked and locked flags)
router.get('/', requireAuth, async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 });
    // mark which are completed/unlocked based on user's progress
    const user = await User.findById(req.userId);
    const completed = user?.progress?.completed_lessons || [];
    const payload = lessons.map(l => ({
      id: l._id,
      title: l.title,
      summary: l.summary,
      locked: l.locked,
      completed: completed.includes(String(l._id))
    }));
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get lesson by id (content/url and metadata)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ msg: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
