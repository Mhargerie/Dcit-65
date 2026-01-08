import express from 'express';
import User from '../models/User.js';
import { genSalt, hash, compare } from 'bcryptjs';
import pkg from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const router = express.Router();
const { sign } = pkg;


// REGISTER
router.post('/register', async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ msg: 'Fields required' });
    }

    // Encrypt description if present
    let encryptedDesc = '';
    if (req.body.description) {
      encryptedDesc = CryptoJS.AES.encrypt(req.body.description, process.env.ENC_KEY).toString();
    }

    // Server-side bcrypt of client-hashed password
    const salt = await genSalt(10);
    const serverHashedPassword = await hash(req.body.password, salt);

    const newUser = new User({
      full_name: req.body.full_name || '',
      username: req.body.username,
      email: req.body.email || `user_${Date.now()}@example.com`,
      age: req.body.age || 0,
      birthdate: req.body.birthdate || Date.now(),
      password: serverHashedPassword,
      school: req.body.school || '',
      description_enc: encryptedDesc
    });

    await newUser.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    // Duplicate key (username) handling
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        description: user.getDecryptedDescription ? user.getDecryptedDescription() : ''
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;