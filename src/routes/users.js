'use strict';

const express = require('express');
const router = express.Router();
const dbPromise = require('../db');
const { requireAdmin, requireAuth } = require('../middleware/auth');

// GET /api/users/directory — public users list for messaging (auth required)
router.get('/directory', requireAuth, async (req, res) => {
  try {
    const db = await dbPromise;
    const users = await db.all(
      'SELECT id, username, avatar, lastSeen FROM users WHERE id != ? ORDER BY username ASC',
      [req.user.id]
    );
    res.json(users);
  } catch (err) {
    console.error('Directory error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// GET /api/users — list all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const db = await dbPromise;
    const users = await db.all(
      'SELECT id, username, role, createdAt FROM users ORDER BY createdAt DESC'
    );
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// PATCH /api/users/:id — change user role (admin only)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Недопустимая роль' });
    }
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Нельзя изменить свою роль' });
    }
    const db = await dbPromise;
    const result = await db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json({ message: 'Роль обновлена' });
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// DELETE /api/users/:id — delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Нельзя удалить свой аккаунт' });
    }
    const db = await dbPromise;
    const result = await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
