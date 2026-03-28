'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const services = require('../data/services');
const dbPromise = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// All application routes require auth
router.use(requireAuth);

function statusLabel(status) {
  const map = {
    pending: 'На рассмотрении',
    processing: 'В обработке',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    cancelled: 'Отменено'
  };
  return map[status] || status;
}

/**
 * POST /api/applications
 * Body: { serviceId, formData }
 */
router.post('/', async (req, res) => {
  try {
    const { serviceId, formData } = req.body;

    if (!serviceId) {
      return res.status(400).json({ error: 'Не указана услуга' });
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    // Validate required fields
    const missingFields = [];
    if (service.formFields && Array.isArray(service.formFields)) {
      for (const field of service.formFields) {
        if (field.required && (!formData || !formData[field.name] || String(formData[field.name]).trim() === '')) {
          missingFields.push(field.label);
        }
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Заполните обязательные поля: ${missingFields.join(', ')}`
      });
    }

    const application = {
      id: uuidv4(),
      userId: req.user.id,
      serviceId,
      serviceTitle: service.title,
      serviceCategory: service.category,
      formData: JSON.stringify(formData || {}),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const db = await dbPromise;
    await db.run(
      `INSERT INTO applications (id, userId, serviceId, serviceTitle, serviceCategory, formData, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [application.id, application.userId, application.serviceId, application.serviceTitle, application.serviceCategory, application.formData, application.status, application.createdAt, application.updatedAt]
    );

    return res.status(201).json({
      message: 'Заявка успешно подана',
      application: {
        ...application,
        formData: JSON.parse(application.formData),
        statusLabel: statusLabel(application.status)
      }
    });
  } catch (err) {
    console.error('Create application error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/applications/all
 * Returns ALL applications (Admin only)
 */
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const db = await dbPromise;
    const allApps = await db.all(
      `SELECT a.*, u.username
       FROM applications a
       LEFT JOIN users u ON a.userId = u.id
       ORDER BY a.createdAt DESC`
    );

    const formattedApps = allApps.map(a => ({
      ...a,
      formData: JSON.parse(a.formData),
      statusLabel: statusLabel(a.status)
    }));

    return res.json({ applications: formattedApps, total: formattedApps.length });
  } catch (err) {
    console.error('Get all applications error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/applications
 * Returns current user's applications
 */
router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const userApplications = await db.all('SELECT * FROM applications WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
    
    const formattedApps = userApplications.map(a => ({
      ...a,
      formData: JSON.parse(a.formData),
      statusLabel: statusLabel(a.status)
    }));

    return res.json({ applications: formattedApps, total: formattedApps.length });
  } catch (err) {
    console.error('Get user applications error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/applications/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const application = await db.get('SELECT * FROM applications WHERE id = ?', [req.params.id]);

    if (!application) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    // Only allow admin or the owner to view
    if (application.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const service = services.find(s => s.id === application.serviceId);

    return res.json({
      application: {
        ...application,
        formData: JSON.parse(application.formData),
        statusLabel: statusLabel(application.status),
        service: service || null
      }
    });
  } catch (err) {
    console.error('Get application error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PATCH /api/applications/:id/status
 * Admin only: update application status
 */
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'processing', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const db = await dbPromise;
    const updatedAt = new Date().toISOString();
    
    const result = await db.run('UPDATE applications SET status = ?, updatedAt = ? WHERE id = ?', [status, updatedAt, req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    return res.json({ message: 'Статус успешно обновлен' });
  } catch (err) {
    console.error('Update application status error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PATCH /api/applications/:id/cancel
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const db = await dbPromise;
    const application = await db.get('SELECT * FROM applications WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);

    if (!application) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    if (application.status === 'cancelled') {
      return res.status(400).json({ error: 'Заявка уже отменена' });
    }

    if (['approved', 'rejected'].includes(application.status)) {
      return res.status(400).json({ error: 'Нельзя отменить завершённую заявку' });
    }

    const updatedAt = new Date().toISOString();
    await db.run('UPDATE applications SET status = ?, updatedAt = ? WHERE id = ?', ['cancelled', updatedAt, req.params.id]);

    return res.json({
      message: 'Заявка успешно отменена',
      application: {
        ...application,
        formData: JSON.parse(application.formData),
        status: 'cancelled',
        updatedAt,
        statusLabel: statusLabel('cancelled')
      }
    });
  } catch (err) {
    console.error('Cancel application error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
