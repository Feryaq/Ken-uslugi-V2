'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const dbPromise = require('../db');
const { requireAdmin } = require('../middleware/auth');

// POST /api/citizens — подать заявку на гражданство/службу
router.post('/', async (req, res) => {
  try {
    const { type, nickname, age, city, wish } = req.body;
    if (!type || !nickname) {
      return res.status(400).json({ error: 'Укажите тип заявки и ник' });
    }

    const app = {
      id: uuidv4(),
      type,       // 'citizenship' | 'service'
      nickname: nickname.trim(),
      age: age || null,
      city: city || null,
      wish: wish || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const db = await dbPromise;
    await db.run(
      'INSERT INTO citizens (id, type, nickname, age, city, wish, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [app.id, app.type, app.nickname, app.age, app.city, app.wish, app.status, app.createdAt]
    );

    res.status(201).json({ message: 'Заявка принята', id: app.id });
  } catch (err) {
    console.error('Create citizen application error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// GET /api/citizens — список (защищено: requireAdmin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const db = await dbPromise;
    const applications = await db.all('SELECT * FROM citizens ORDER BY createdAt DESC');
    res.json(applications);
  } catch (err) {
    console.error('Get citizens error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// PATCH /api/citizens/:id/status — изменить статус заявки (защищено: requireAdmin)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const db = await dbPromise;
    const result = await db.run('UPDATE citizens SET status = ? WHERE id = ?', [status, req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.json({ message: 'Статус обновлен' });
  } catch (err) {
    console.error('Update citizen status error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
