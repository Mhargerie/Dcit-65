import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile (no special characters allowed except underscores and dots)
router.put('/', requireAuth, async (req, res) => {
  try {
    const { full_name, birthdate, school, description } = req.body;
    const regex = /^[A-Za-z0-9 _\.]+$/;
    if (full_name && !regex.test(full_name)) return res.status(400).json({ msg: 'Invalid characters in full_name' });
    if (school && !regex.test(school)) return res.status(400).json({ msg: 'Invalid characters in school' });
    if (description && !regex.test(description)) return res.status(400).json({ msg: 'Invalid characters in description' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (full_name) user.full_name = full_name;
    if (birthdate) user.birthdate = new Date(birthdate);
    if (school) user.school = school;
    if (description) user.description_enc = description; // we store encrypted, but per spec we can leave as plain for now
    await user.save();
    res.json({ msg: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
