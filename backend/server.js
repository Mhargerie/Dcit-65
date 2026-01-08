import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import { connect } from 'mongoose';
// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
dotenv.config()

const app = express();

// [cite_start]// --- SECURITY MIDDLEWARE LAYER [cite: 14] ---

// 1. Set Security HTTP Headers
app.use(helmet());

// 2. Limit requests from same API (DoS protection)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// 3. Body Parser, reading data from body into req.body
app.use(json({ limit: '10kb' })); // Limit body size to prevent overload

// Basic fallback: remove MongoDB operator chars from keys
function fallbackMongoSanitize() {
  return (req, res, next) => {
    const sanitizeKeys = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        const cleanKey = key.replace(/\$/g, '').replace(/\./g, '');
        if (cleanKey !== key) {
          obj[cleanKey] = val;
          delete obj[key];
        }
        if (typeof obj[cleanKey] === 'object') sanitizeKeys(obj[cleanKey]);
      }
    };
    sanitizeKeys(req.body);
    sanitizeKeys(req.query);
    sanitizeKeys(req.params);
    next();
  };
}

// Basic fallback: escape angle brackets in string inputs
function fallbackXssClean() {
  return (req, res, next) => {
    const escapeStr = (s) => (typeof s === 'string' ? s.replace(/</g, '&lt;').replace(/>/g, '&gt;') : s);
    const walk = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'string') obj[k] = escapeStr(obj[k]);
        else if (typeof obj[k] === 'object') walk(obj[k]);
      }
    };
    // safe-guard: ensure req/* exist before walking
    if (req.body) walk(req.body);
    if (req.query) walk(req.query);
    if (req.params) walk(req.params);
    next();
  };
}

// use the safe loader at startup - top-level await ok in ESM
app.use(fallbackMongoSanitize());
app.use(fallbackXssClean());

// 6. CORS (Restrict to allowed origin during dev; set CORS_ORIGIN in .env)
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// quick health check
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// --- DATABASE CONNECTION ---
connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Securely'))
  .catch(err => console.log(err));

// --- ROUTES ---
import assessmentsRoutes from './routes/assessments.js';
import authRoutes from './routes/auth.js';
import calendarRoutes from './routes/calendar.js';
import lessonsRoutes from './routes/lessons.js';
import profileRoutes from './routes/profile.js';
import quizzesRoutes from './routes/quizzes.js';

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server secure on ${HOST}:${PORT}`));