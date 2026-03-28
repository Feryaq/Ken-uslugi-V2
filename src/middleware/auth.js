'use strict';

const dbPromise = require('../db');

/**
 * Middleware: require authenticated session.
 * Attaches req.user from session.
 */
async function requireAuth(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }

    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.session.userId]);
    
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Сессия истекла. Войдите снова.' });
    }

    // Update lastSeen (fire-and-forget, throttled to once per 30s)
    const now = Date.now();
    if (!user.lastSeen || now - new Date(user.lastSeen).getTime() > 30000) {
      db.run('UPDATE users SET lastSeen = ? WHERE id = ?', [new Date(now).toISOString(), user.id]).catch(() => {});
    }

    // Attach user without password
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}

/**
 * Middleware: require admin role.
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }

    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.session.userId]);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}

module.exports = { requireAuth, requireAdmin };
