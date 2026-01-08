import express from 'express';
import Lesson from '../models/Lesson.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get a sampled assessment for a lesson (15 random questions)
router.get('/lesson/:id', requireAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ msg: 'Lesson not found' });
    const questions = lesson.questions || [];
    // shuffle and take up to 15
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 15).map(q => ({
      id: q._id,
      type: q.type,
      question: q.question,
      choices: q.choices
    }));
    // create an unfinished attempt
    const attempt = await Attempt.create({ user: req.userId, lesson: lesson._id, maxScore: shuffled.length, completed: false });
    res.json({ attemptId: attempt._id, questions: shuffled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit assessment attempt
router.post('/submit/:attemptId', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: answer }
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ msg: 'Attempt not found' });
    if (String(attempt.user) !== String(req.userId)) return res.status(403).json({ msg: 'Forbidden' });

    // fetch lesson and its questions
    const lesson = await Lesson.findById(attempt.lesson);
    const qmap = {};
    (lesson.questions || []).forEach(q => { qmap[String(q._id)] = q; });

    let correct = 0;
    for (const [qid, ans] of Object.entries(answers || {})) {
      const q = qmap[qid];
      if (!q) continue;
      // simple equality check; for arrays or lowercased strings you can adjust
      if (String(q.answer).toLowerCase() === String(ans).toLowerCase()) correct++;
    }

    const score = correct;
    attempt.answers = answers;
    attempt.score = score;
    attempt.completed = true;
    await attempt.save();

    // update user's progress
    const user = await User.findById(req.userId);
    user.progress = user.progress || { completed_lessons: [] };
    const completed = user.progress.completed_lessons || [];
    if (!completed.includes(String(lesson._id))) completed.push(String(lesson._id));
    user.progress.completed_lessons = completed;
    await user.save();

    // compute completion percentage and unlock logic
    const totalLessons = await Lesson.countDocuments();
    const completedCount = completed.length;
    const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
    if (percent >= 70) {
      // unlock all lessons as grouping unlock (simple implementation)
      await Lesson.updateMany({}, { $set: { locked: false } });
    }

    // color mapping per spec
    let color = 'red';
    const pct = attempt.maxScore ? Math.round((score / attempt.maxScore) * 100) : 0;
    if (pct <= 33) color = 'orange';
    else if (pct <= 67) color = 'orange';
    else if (pct <= 80) color = 'yellow';
    else color = 'green';

    res.json({ score, maxScore: attempt.maxScore, percent: pct, color });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's attempts
router.get('/me', requireAuth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
