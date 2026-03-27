'use strict';

const express = require('express');
const router = express.Router();
const services = require('../data/services');

/**
 * GET /api/services/categories
 * Returns list of unique categories
 */
router.get('/categories', (req, res) => {
  const categories = [...new Set(services.map(s => s.category))];
  return res.json({ categories });
});

/**
 * GET /api/services
 * Query: ?category=X&search=Y&popular=true
 */
router.get('/', (req, res) => {
  let result = [...services];

  const { category, search, popular } = req.query;

  if (category && category !== 'all') {
    result = result.filter(s => s.category === category);
  }

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  }

  if (popular === 'true') {
    result = result.filter(s => s.popular === true);
  }

  // Return without formFields for list view
  const slim = result.map(({ formFields, ...rest }) => rest);
  return res.json({ services: slim, total: slim.length });
});

/**
 * GET /api/services/:id
 * Returns full service detail including formFields
 */
router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Услуга не найдена' });
  }
  return res.json({ service });
});

module.exports = router;
