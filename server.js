'use strict';

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

// Initialize database
require('./src/db');

const authRoutes = require('./src/routes/auth');
const servicesRoutes = require('./src/routes/services');
const applicationsRoutes = require('./src/routes/applications');
const newsRoutes = require('./src/routes/news');
const citizensRoutes = require('./src/routes/citizens');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'egov-kz-secret-2024-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true if behind HTTPS proxy
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ─────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/citizens', citizensRoutes);

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
