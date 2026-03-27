/**
 * api.js — Fetch wrapper for ЕГов API calls
 */

const API_BASE = '/api';

/**
 * Core request function
 */
async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin'
  };

  if (body !== null) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(API_BASE + path, opts);

  let data;
  try {
    data = await res.json();
  } catch {
    data = { error: `Ошибка сервера (${res.status})` };
  }

  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const api = {
  // ── Auth ────────────────────────────────────────────────
  auth: {
    register: (payload) => request('POST', '/auth/register', payload),
    login:    (payload) => request('POST', '/auth/login',    payload),
    logout:   ()        => request('POST', '/auth/logout'),
    me:       ()        => request('GET',  '/auth/me')
  },

  // ── Services ────────────────────────────────────────────
  services: {
    list:       (params = {}) => {
      const qs = new URLSearchParams();
      if (params.category && params.category !== 'all') qs.set('category', params.category);
      if (params.search)   qs.set('search',   params.search);
      if (params.popular)  qs.set('popular',  'true');
      const q = qs.toString();
      return request('GET', '/services' + (q ? '?' + q : ''));
    },
    get:        (id)    => request('GET', `/services/${id}`),
    categories: ()      => request('GET', '/services/categories')
  },

  // ── Applications ─────────────────────────────────────────
  applications: {
    create:   (payload) => request('POST',  '/applications',       payload),
    list:     ()        => request('GET',   '/applications'),
    get:      (id)      => request('GET',   `/applications/${id}`),
    cancel:   (id)      => request('PATCH', `/applications/${id}/cancel`),
    updateStatus: (id, status) => request('PATCH', `/applications/${id}/status`, { status }),
    listAll:  ()        => request('GET',   '/applications/all')
  },

  // ── Citizens (City/Citizenship) ──────────────────────────
  citizens: {
    list:     ()               => request('GET',   '/citizens'),
    updateStatus: (id, status) => request('PATCH', `/citizens/${id}/status`, { status })
  },

  // ── News ────────────────────────────────────────────────
  news: {
    list:     ()         => request('GET',    '/news'),
    create:   (body)     => request('POST',   '/news', body),
    update:   (id, body) => request('PUT',    `/news/${id}`, body),
    delete:   (id)       => request('DELETE', `/news/${id}`)
  },

  // ── Users (admin) ───────────────────────────────────────
  users: {
    list:       ()           => request('GET',    '/users'),
    updateRole: (id, role)   => request('PATCH',  `/users/${id}`, { role }),
    delete:     (id)         => request('DELETE', `/users/${id}`)
  },

  // ── Account self-management ─────────────────────────────
  account: {
    update: (payload) => request('PATCH', '/auth/me', payload)
  }
};

window.api = api;
