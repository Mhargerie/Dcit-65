import express from 'express';
import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// List quizzes
router.get('/', requireAuth, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes.map(q => ({ id: q._id, title: q.title, description: q.description })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a quiz (full questions) and create attempt
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    // sample all questions or shuffle if desired
    const questions = quiz.questions.map(q => ({ id: q._id, type: q.type, question: q.question, choices: q.choices }));
    const attempt = await Attempt.create({ user: req.userId, quiz: quiz._id, maxScore: questions.length, completed: false });
    res.json({ attemptId: attempt._id, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit quiz attempt
router.post('/submit/:attemptId', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ msg: 'Attempt not found' });
    if (String(attempt.user) !== String(req.userId)) return res.status(403).json({ msg: 'Forbidden' });

    const quiz = await Quiz.findById(attempt.quiz);
    const qmap = {};
    (quiz.questions || []).forEach(q => { qmap[String(q._id)] = q; });

    let correct = 0;
    for (const [qid, ans] of Object.entries(answers || {})) {
      const q = qmap[qid];
      if (!q) continue;
      if (String(q.answer).toLowerCase() === String(ans).toLowerCase()) correct++;
    }

    attempt.answers = answers;
    attempt.score = correct;
    attempt.completed = true;
    await attempt.save();

    const pct = attempt.maxScore ? Math.round((correct / attempt.maxScore) * 100) : 0;
    let color = 'red';
    if (pct <= 33) color = 'orange';
    else if (pct <= 67) color = 'orange';
    else if (pct <= 80) color = 'yellow';
    else color = 'green';

    res.json({ score: correct, maxScore: attempt.maxScore, percent: pct, color });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
