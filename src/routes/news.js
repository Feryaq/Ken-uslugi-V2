'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const dbPromise = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/news — список новостей
router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const news = await db.all('SELECT * FROM news ORDER BY createdAt DESC');
    res.json(news);
  } catch (err) {
    console.error('Get news error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// POST /api/news — добавить новость (защищено: requireAdmin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, text, date, image, amethyst } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: 'Нужны title и text' });
    }

    const item = {
      id: uuidv4(),
      image: image || '/images/news1.jpg',
      date: date || new Date().toLocaleDateString('ru-RU'),
      title,
      text,
      amethyst: amethyst || 'АметистNews',
      createdAt: new Date().toISOString()
    };

    const db = await dbPromise;
    await db.run(
      'INSERT INTO news (id, image, date, title, text, amethyst, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.id, item.image, item.date, item.title, item.text, item.amethyst, item.createdAt]
    );

    res.status(201).json(item);
  } catch (err) {
    console.error('Post news error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// PUT /api/news/:id — edit news (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, text, date, image, amethyst } = req.body;
    if (!title || !text) return res.status(400).json({ error: 'Нужны title и text' });

    const db = await dbPromise;
    const result = await db.run(
      'UPDATE news SET title = ?, text = ?, date = ?, image = ?, amethyst = ? WHERE id = ?',
      [title, text, date || new Date().toLocaleDateString('ru-RU'),
       image || '/images/news1.jpg', amethyst || 'АметистNews', req.params.id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Новость не найдена' });
    const item = await db.get('SELECT * FROM news WHERE id = ?', [req.params.id]);
    res.json(item);
  } catch (err) {
    console.error('Put news error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// DELETE /api/news/:id (защищено: requireAdmin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = await dbPromise;
    const result = await db.run('DELETE FROM news WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }

    res.json({ message: 'Удалено' });
  } catch (err) {
    console.error('Delete news error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
