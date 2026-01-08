import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found in environment. Check backend/.env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'test' });
  console.log('Connected to DB for seeding');

  // Clear existing sample content (only for seed safety)
  await Lesson.deleteMany({});
  await Quiz.deleteMany({});

  // Create sample lessons
  const lessons = [
    {
      title: 'Introduction to the Constitution',
      summary: 'Overview of the constitution articles and history',
      locked: false,
      questions: [
        { type: 'mcq', question: 'Who wrote the constitution?', choices: ['A','B','C','D'], answer: 'A' },
        { type: 'tf', question: 'The constitution is a living document.', answer: 'true' },
        { type: 'id', question: 'Name one branch of government.', answer: 'executive' }
      ]
    },
    {
      title: 'Republic Acts Overview',
      summary: 'Summary of key Republic Acts',
      locked: true,
      questions: [
        { type: 'mcq', question: 'RA stands for?', choices: ['Republic Act','Random Act'], answer: 'Republic Act' },
        { type: 'tf', question: 'RA are laws passed by the legislature.', answer: 'true' }
      ]
    },
    {
      title: 'Civil Liberties',
      summary: 'Rights and freedoms guaranteed',
      locked: true,
      questions: [
        { type: 'mcq', question: 'Freedom of speech is in which amendment?', choices: ['1','2','3'], answer: '1' }
      ]
    }
  ];

  await Lesson.insertMany(lessons);
  console.log('Seeded lessons');

  const quizzes = [
    {
      title: 'Constitution Quick Quiz',
      description: 'Mixed questions from constitution lessons',
      questions: [
        { type: 'mcq', question: 'Which article deals with the executive?', choices: ['1','2','3'], answer: '2' },
        { type: 'tf', question: 'The constitution establishes separation of powers.', answer: 'true' }
      ]
    }
  ];

  await Quiz.insertMany(quizzes);
  console.log('Seeded quizzes');

  await mongoose.disconnect();
  console.log('Disconnected');
}

seed().catch(err => { console.error(err); process.exit(1); });
