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
  },

  // ── Upload (multipart) ───────────────────────────────────
  upload: {
    image: async (file) => {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/upload/image', { method: 'POST', credentials: 'same-origin', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      return data;
    },
    avatar: async (file) => {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch('/api/upload/avatar', { method: 'POST', credentials: 'same-origin', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      return data;
    },
    attachment: async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/attachment', { method: 'POST', credentials: 'same-origin', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      return data; // { url, name }
    }
  },

  // ── Messages ────────────────────────────────────────────
  messages: {
    conversations: ()           => request('GET',   '/messages/conversations'),
    unread:        ()           => request('GET',   '/messages/unread'),
    global:        (after)      => request('GET',   '/messages/global' + (after ? `?after=${encodeURIComponent(after)}` : '')),
    sendGlobal:    (text, attachmentUrl, attachmentName) => request('POST',  '/messages/global', { text, attachmentUrl, attachmentName }),
    dm:            (uid, after) => request('GET',   `/messages/dm/${uid}` + (after ? `?after=${encodeURIComponent(after)}` : '')),
    sendDm:        (uid, text, attachmentUrl, attachmentName) => request('POST',  `/messages/dm/${uid}`, { text, attachmentUrl, attachmentName }),
    edit:          (id, text)   => request('PUT',   `/messages/${id}`, { text }),
    markRead:      (uid)        => request('PATCH', `/messages/read/${uid}`),
    delete:        (id)         => request('DELETE',`/messages/${id}`)
  },

  // ── Users directory ─────────────────────────────────────
  directory: () => request('GET', '/users/directory')
};

window.api = api;
