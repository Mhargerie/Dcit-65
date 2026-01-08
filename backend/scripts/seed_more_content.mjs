import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: './backend/.env' });

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not defined in backend/.env');
  process.exit(1);
}

await mongoose.connect(uri, {});

const db = mongoose.connection;

const lessons = [
  {
    title: "Philippine Constitution — Overview",
    summary: "High-level overview of the Constitution: structure, principles, and key provisions.",
    content: "<h2>Philippine Constitution</h2><p>The Constitution establishes the structure of government...</p>",
    group: "constitution",
    order: 1,
    createdAt: new Date(),
  },
  {
    title: "Bill of Rights — Key Rights",
    summary: "Summary of fundamental civil liberties and protections in the Bill of Rights.",
    content: "<h2>Bill of Rights</h2><ul><li>Freedom of speech</li><li>Due process</li></ul>",
    group: "constitution",
    order: 2,
    createdAt: new Date(),
  },
  {
    title: "Administrative Law — Basics",
    summary: "Introduction to administrative law and administrative agencies.",
    content: "<h2>Administrative Law</h2><p>Administrative law governs the activities of administrative agencies...</p>",
    group: "law",
    order: 1,
    createdAt: new Date(),
  },
  {
    title: "Republic Act No. 386 — Civil Code (summary)",
    summary: "Concise summary of important civil law principles under the Civil Code.",
    content: "<h2>Civil Code (RA 386)</h2><p>Contracts, property, obligations...</p>",
    group: "ra",
    order: 1,
    createdAt: new Date(),
  },
  {
    title: "Republic Act No. 9262 — Anti-Violence Against Women",
    summary: "Summary of RA 9262: protected persons, acts of violence, remedies.",
    content: "<h2>RA 9262</h2><p>Scope, protection orders, penalties...</p>",
    group: "ra",
    order: 2,
    createdAt: new Date(),
  },
  {
    title: "Criminal Law — Elements of a Crime",
    summary: "Basic elements required to constitute a criminal offense.",
    content: "<h2>Criminal Law</h2><p>Actus reus, mens rea, concurrence, causation...</p>",
    group: "law",
    order: 2,
    createdAt: new Date(),
  }
];

const quizzes = [
  {
    title: "Constitution Basics Quiz",
    description: "Mixed types: MCQ, True/False, Identification about the Constitution.",
    questions: [
      { id: 'q1', type: 'mcq', question: 'Which branch interprets the law?', choices: ['Legislative', 'Executive', 'Judicial', 'None'], answer: 'Judicial', points: 1 },
      { id: 'q2', type: 'tf', question: 'The Bill of Rights is part of the Constitution.', answer: 'true', points: 1 },
      { id: 'q3', type: 'id', question: 'Name one fundamental freedom protected by the Bill of Rights.', answer: 'speech', points: 1 }
    ],
    createdAt: new Date()
  },
  {
    title: "Civil Code Essentials",
    description: "Short quiz on basic civil law concepts.",
    questions: [
      { id: 'c1', type: 'mcq', question: 'Which governs contracts?', choices: ['Criminal Code', 'Civil Code', 'Administrative Code', 'Election Code'], answer: 'Civil Code', points: 1 },
      { id: 'c2', type: 'id', question: 'Give one remedy for breach of contract.', answer: 'damages', points: 1 },
      { id: 'c3', type: 'tf', question: 'Property law is part of the Civil Code.', answer: 'true', points: 1 }
    ],
    createdAt: new Date()
  },
  {
    title: "RA 9262 Quick Check",
    description: "Quiz on protections and remedies under RA 9262.",
    questions: [
      { id: 'r1', type: 'tf', question: 'RA 9262 only applies to married couples.', answer: 'false', points: 1 },
      { id: 'r2', type: 'id', question: 'One legal remedy available under RA 9262 (one word).', answer: 'protectionorder', points: 1 }
    ],
    createdAt: new Date()
  }
];

try {
  console.log('Clearing existing seed collections (lessons, quizzes)...');
  await db.collection('lessons').deleteMany({});
  await db.collection('quizzes').deleteMany({});

  const lres = await db.collection('lessons').insertMany(lessons);
  const qres = await db.collection('quizzes').insertMany(quizzes);

  console.log(`Inserted ${lres.insertedCount} lessons and ${qres.insertedCount} quizzes.`);
} catch (err) {
  console.error('Seeding failed:', err);
} finally {
  await mongoose.disconnect();
  process.exit(0);
}