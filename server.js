'use strict';

const express   = require('express');
const session   = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cors      = require('cors');
const path      = require('path');
const rateLimit = require('express-rate-limit');

// Initialize database
require('./src/db');

const authRoutes         = require('./src/routes/auth');
const servicesRoutes     = require('./src/routes/services');
const applicationsRoutes = require('./src/routes/applications');
const newsRoutes         = require('./src/routes/news');
const citizensRoutes     = require('./src/routes/citizens');
const usersRoutes        = require('./src/routes/users');
const uploadRoutes       = require('./src/routes/upload');
const messagesRoutes     = require('./src/routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.ORIGIN || true, // restrict in production via ORIGIN env var
  credentials: true
}));

// Rate-limit auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много попыток. Повторите через 15 минут.' }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'egov-kz-secret-2024-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({
    db: 'sessions.sqlite',
    dir: '.',
    table: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false, // set true if behind HTTPS proxy
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ─────────────────────────────────────────────────────────────────

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services',     servicesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/news',         newsRoutes);
app.use('/api/citizens',     citizensRoutes);
app.use('/api/users',        usersRoutes);
app.use('/api/upload',       uploadRoutes);
app.use('/api/messages',     messagesRoutes);

// ── Health check ───────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve index.html for client-side routing ────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error handler ──────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ── Start ──────────────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Кен услуги сервер запущен: http://localhost:${PORT}`);
});

module.exports = app;
