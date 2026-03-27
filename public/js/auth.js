/**
 * auth.js — Authentication helpers used across all pages
 */

let _currentUser = null;

/**
 * Returns cached user or fetches from API.
 * Returns null if not authenticated.
 */
async function getCurrentUser(force = false) {
  if (_currentUser && !force) return _currentUser;
  try {
    const data = await api.auth.me();
    _currentUser = data.user;
    return _currentUser;
  } catch {
    _currentUser = null;
    return null;
  }
}

/**
 * Redirects to login if not authenticated.
 * Call at top of protected pages.
 */
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    return null;
  }
  return user;
}

/**
 * Updates navigation bar items based on auth state.
 * Expects nav links to have data-auth="guest" or data-auth="user".
 */
async function updateNavbar() {
  const user = await getCurrentUser();

  document.querySelectorAll('[data-auth]').forEach(el => {
    const role = el.getAttribute('data-auth');
    if (role === 'user') {
      el.style.display = user ? '' : 'none';
    } else if (role === 'guest') {
      el.style.display = user ? 'none' : '';
    } else if (role === 'admin') {
      el.style.display = (user && user.role === 'admin') ? '' : 'none';
    }
  });

  // Update profile name in nav if element exists
  const navName = document.getElementById('nav-user-name');
  if (navName && user) {
    const parts = user.fullName.trim().split(' ');
    navName.textContent = parts[0]; // show first name
  }

  // Mark active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && currentPath === href) {
      a.classList.add('active');
    }
  });
}

/**
 * Logout and redirect to home.
 */
async function logout() {
  try {
    await api.auth.logout();
  } catch (_) { /* ignore */ }
  _currentUser = null;
  window.location.href = '/';
}

// ── Toast notifications ──────────────────────────────────────────────────────

function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Закрыть">✕</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }

  return toast;
}

function removeToast(toast) {
  toast.classList.add('hiding');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

// ── Utility ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

const categoryIcons = {
  'Документы и регистрация': '🪪',
  'Транспорт':               '🚗',
  'Бизнес':                  '💼',
  'Социальная защита':       '🤝',
  'Образование':             '🎓',
  'Здоровье':                '🏥',
  'Налоги и финансы':        '💰',
  'Жильё и ЖКХ':            '🏠'
};

function getCategoryIcon(category) {
  return categoryIcons[category] || '📋';
}

function getStatusBadge(status) {
  const map = {
    pending:    ['badge-pending',    '⏳ На рассмотрении'],
    processing: ['badge-processing', '🔄 В обработке'],
    approved:   ['badge-approved',   '✅ Одобрено'],
    rejected:   ['badge-rejected',   '❌ Отклонено'],
    cancelled:  ['badge-cancelled',  '🚫 Отменено']
  };
  const [cls, label] = map[status] || ['badge-pending', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ── Hamburger menu ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
      }
    });
  }

  // Logout buttons
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
});

// Export to global scope
window.getCurrentUser  = getCurrentUser;
window.requireAuth     = requireAuth;
window.updateNavbar    = updateNavbar;
window.logout          = logout;
window.showToast       = showToast;
window.escapeHtml      = escapeHtml;
window.formatDate      = formatDate;
window.formatDateShort = formatDateShort;
window.getCategoryIcon = getCategoryIcon;
window.getStatusBadge  = getStatusBadge;
