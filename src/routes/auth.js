'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router  = express.Router();

const dbPromise = require('../db');
const { requireAuth } = require('../middleware/auth');

// POST /api/auth/register  { username, password }
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Укажите логин и пароль' });

    if (username.trim().length < 3)
      return res.status(400).json({ error: 'Логин минимум 3 символа' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Пароль минимум 6 символов' });

    const db = await dbPromise;
    
    const existing = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username.trim()]);
    if (existing)
      return res.status(409).json({ error: 'Этот логин уже занят' });

    const hashed = await bcrypt.hash(password, 10);
    const newId = uuidv4();
    const createdAt = new Date().toISOString();
    
    await db.run(
      'INSERT INTO users (id, username, password, role, createdAt) VALUES (?, ?, ?, ?, ?)',
      [newId, username.trim(), hashed, 'user', createdAt]
    );

    req.session.userId = newId;

    const safe = { id: newId, username: username.trim(), role: 'user', createdAt };
    return res.status(201).json({ message: 'Аккаунт создан', user: safe });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// POST /api/auth/login  { username, password }
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Укажите логин и пароль' });

    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username.trim()]);
    
    if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' });

    req.session.userId = user.id;
    const { password: _, ...safe } = user;
    return res.json({ message: 'Вход выполнен', user: safe });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Выход выполнен' });
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

// PATCH /api/auth/me — change own username or password
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const { newUsername, currentPassword, newPassword } = req.body;
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);

    if (newPassword !== undefined) {
      if (!currentPassword) return res.status(400).json({ error: 'Укажите текущий пароль' });
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(401).json({ error: 'Неверный текущий пароль' });
      if (newPassword.length < 6) return res.status(400).json({ error: 'Новый пароль минимум 6 символов' });
      const hashed = await bcrypt.hash(newPassword, 10);
      await db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    }

    if (newUsername !== undefined) {
      if (newUsername.trim().length < 3) return res.status(400).json({ error: 'Логин минимум 3 символа' });
      const existing = await db.get(
        'SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?',
        [newUsername.trim(), req.user.id]
      );
      if (existing) return res.status(409).json({ error: 'Этот логин уже занят' });
      await db.run('UPDATE users SET username = ? WHERE id = ?', [newUsername.trim(), req.user.id]);
    }

    const updated = await db.get('SELECT id, username, role, createdAt FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Данные обновлены', user: updated });
  } catch (err) {
    console.error('Update me error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
