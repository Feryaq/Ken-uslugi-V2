/**
 * admin.js — Admin panel logic
 */

const NEWS_IMAGES = [
  '/images/news1.jpg',
  '/images/news2.jpg',
  '/images/news3.jpg',
  '/images/news5.jpg',
  '/images/news6.jpg',
  '/images/news7.jpg',
  '/images/news8.jpg',
  '/images/news9.jpg',
  '/images/news10.jpg',
  '/images/news11.jpg',
  '/images/news12.jpg',
];

let editingNewsId = null;
let currentAdminId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth();
  if (!user || user.role !== 'admin') {
    window.location.href = '/profile.html';
    return;
  }
  currentAdminId = user.id;
  document.getElementById('admin-name').textContent = user.username;

  document.getElementById('last-update').textContent = 'Обновлено: ' + new Date().toLocaleTimeString('ru-RU');

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
  });

  // Initial load
  loadCitizens();
  loadApplications();
  loadNews();
  loadUsers();
  setupNewsBuilder();
});

// ── Citizens ─────────────────────────────────────────────────────────────────

async function loadCitizens() {
  const tbody = document.getElementById('citizens-list');
  if (!tbody) return;
  try {
    const data = await api.citizens.list();
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">Заявок нет</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${formatDateShort(item.createdAt)}</td>
        <td>${item.type === 'citizenship' ? 'Гражданство' : 'Служба'}</td>
        <td><strong>${escapeHtml(item.nickname)}</strong></td>
        <td>${escapeHtml(item.age || '—')} / ${escapeHtml(item.city || '—')}</td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <button class="action-btn btn-approve" onclick="updateCitizenStatus('${item.id}', 'approved')">Одобрить</button>
          <button class="action-btn btn-reject"  onclick="updateCitizenStatus('${item.id}', 'rejected')">Отклонить</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:red;padding:12px">Ошибка: ${escapeHtml(err.message)}</td></tr>`;
  }
}

async function updateCitizenStatus(id, status) {
  try {
    await api.citizens.updateStatus(id, status);
    showToast('Статус обновлён', 'success');
    loadCitizens();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Applications ──────────────────────────────────────────────────────────────

async function loadApplications() {
  const tbody = document.getElementById('apps-list');
  if (!tbody) return;
  try {
    const data = await api.applications.listAll();
    const apps = data.applications || [];
    if (!apps.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;color:#999">Заявок нет</td></tr>`;
      return;
    }
    tbody.innerHTML = apps.map(app => {
      const fd = app.formData || {};
      const fdEntries = Object.entries(fd).filter(([,v]) => v !== '' && v !== null);
      const fdHtml = fdEntries.length
        ? fdEntries.map(([k, v]) => `<span style="display:inline-block;margin-right:10px"><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</span>`).join('')
        : '<em style="color:var(--muted)">нет данных</em>';
      const rowId = 'fd-' + app.id;
      return `
        <tr>
          <td style="white-space:nowrap">${formatDateShort(app.createdAt)}</td>
          <td>
            <strong>${escapeHtml(app.serviceTitle)}</strong>
            <br><span class="badge-category" style="font-size:.72rem">${escapeHtml(app.serviceCategory || '')}</span>
          </td>
          <td>
            <strong style="color:var(--primary)">${escapeHtml(app.username || '—')}</strong>
          </td>
          <td>${getStatusBadge(app.status)}</td>
          <td>
            <select class="status-select" onchange="updateAppStatus('${app.id}', this.value)">
              <option value="pending"    ${app.status === 'pending'    ? 'selected' : ''}>⏳ Ожидание</option>
              <option value="processing" ${app.status === 'processing' ? 'selected' : ''}>🔄 В работе</option>
              <option value="approved"   ${app.status === 'approved'   ? 'selected' : ''}>✅ Одобрено</option>
              <option value="rejected"   ${app.status === 'rejected'   ? 'selected' : ''}>❌ Отклонено</option>
            </select>
          </td>
          <td>
            <button class="action-btn btn-edit" onclick="toggleFormData('${rowId}')">📋 Данные</button>
          </td>
        </tr>
        <tr id="${rowId}" style="display:none;background:var(--bg)">
          <td colspan="6" style="padding:12px 16px;font-size:.85rem;border-top:none">
            <strong style="display:block;margin-bottom:6px;color:var(--muted)">Данные заявки:</strong>
            ${fdHtml}
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:red;padding:12px">Ошибка: ${escapeHtml(err.message)}</td></tr>`;
  }
}

async function updateAppStatus(id, status) {
  try {
    await api.applications.updateStatus(id, status);
    showToast('Статус заявки изменён', 'success');
    loadApplications();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── News Builder ──────────────────────────────────────────────────────────────

function setupNewsBuilder() {
  const form      = document.getElementById('news-form');
  const imgGrid   = document.getElementById('image-grid');
  const imgUrlIn  = document.getElementById('image-url');
  const cancelBtn = document.getElementById('cancel-edit-btn');

  // Build image grid
  NEWS_IMAGES.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'img-thumb';
    img.title = src;
    img.addEventListener('click', () => {
      imgGrid.querySelectorAll('.img-thumb').forEach(t => t.classList.remove('selected'));
      img.classList.add('selected');
      imgUrlIn.value = src;
      updatePreview();
    });
    imgGrid.appendChild(img);
  });

  // Select first by default
  imgGrid.querySelector('.img-thumb').classList.add('selected');

  // Live preview updates
  ['title', 'text', 'date', 'amethyst'].forEach(name => {
    form.elements[name].addEventListener('input', updatePreview);
  });
  imgUrlIn.addEventListener('input', () => {
    imgGrid.querySelectorAll('.img-thumb').forEach(t => t.classList.remove('selected'));
    updatePreview();
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('publish-btn');
    btn.disabled = true;

    const body = {
      title:    form.elements.title.value,
      text:     form.elements.text.value,
      date:     form.elements.date.value || 'СВЕЖЕЕ',
      amethyst: form.elements.amethyst.value || 'АметистNews',
      image:    imgUrlIn.value || '/images/news1.jpg',
    };

    try {
      if (editingNewsId) {
        await api.news.update(editingNewsId, body);
        showToast('Новость обновлена ✅', 'success');
        cancelEdit();
      } else {
        await api.news.create(body);
        showToast('Новость опубликована ✅', 'success');
        form.reset();
        imgGrid.querySelectorAll('.img-thumb').forEach(t => t.classList.remove('selected'));
        imgGrid.querySelector('.img-thumb').classList.add('selected');
        imgUrlIn.value = NEWS_IMAGES[0];
        updatePreview();
      }
      loadNews();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  cancelBtn.addEventListener('click', cancelEdit);
}

function updatePreview() {
  const form = document.getElementById('news-form');
  const imgUrlIn = document.getElementById('image-url');

  document.getElementById('preview-img').src    = imgUrlIn.value || '/images/news1.jpg';
  document.getElementById('preview-title').textContent  = form.elements.title.value   || 'Заголовок новости';
  document.getElementById('preview-text').textContent   = form.elements.text.value    || 'Текст новости появится здесь...';
  document.getElementById('preview-date').textContent   = form.elements.date.value    || 'СВЕЖЕЕ';
  document.getElementById('preview-source').textContent = form.elements.amethyst.value || 'АметистNews';
}

async function loadNews() {
  const tbody = document.getElementById('news-list');
  if (!tbody) return;
  try {
    const news = await api.news.list();
    if (!news.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#999">Новостей нет</td></tr>`;
      return;
    }
    tbody.innerHTML = news.map(n => `
      <tr>
        <td>
          <img src="${escapeHtml(n.image || '')}" alt=""
               style="width:54px;height:34px;object-fit:cover;border-radius:4px"
               onerror="this.style.display='none'">
        </td>
        <td><strong>${escapeHtml(n.title)}</strong></td>
        <td style="white-space:nowrap;font-size:.85em;color:#888">${escapeHtml(n.date || '')} · ${formatDateShort(n.createdAt)}</td>
        <td>
          <button class="action-btn btn-edit"   onclick="editNews('${n.id}')">Редактировать</button>
          <button class="action-btn btn-delete" onclick="deleteNews('${n.id}')">Удалить</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:red;padding:12px">Ошибка: ${escapeHtml(err.message)}</td></tr>`;
  }
}

async function editNews(id) {
  try {
    const news = await api.news.list();
    const item = news.find(n => n.id === id);
    if (!item) return;

    editingNewsId = id;

    const form     = document.getElementById('news-form');
    const imgUrlIn = document.getElementById('image-url');
    const imgGrid  = document.getElementById('image-grid');

    form.elements.title.value   = item.title;
    form.elements.text.value    = item.text;
    form.elements.date.value    = item.date;
    form.elements.amethyst.value = item.amethyst || 'АметистNews';
    imgUrlIn.value              = item.image || '';

    // Try to select matching thumb
    imgGrid.querySelectorAll('.img-thumb').forEach(t => {
      t.classList.toggle('selected', t.src.endsWith(item.image?.split('/').pop()));
    });

    document.getElementById('publish-btn').textContent = 'Сохранить изменения';
    document.getElementById('cancel-edit-btn').style.display = '';
    document.getElementById('edit-banner').style.display = '';
    document.getElementById('edit-title-label').textContent = item.title;

    updatePreview();

    // Switch to news tab and scroll to form
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-tab="tab-news"]').classList.add('active');
    document.getElementById('tab-news').classList.add('active');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function cancelEdit() {
  editingNewsId = null;
  const form = document.getElementById('news-form');
  form.reset();
  document.getElementById('image-url').value = NEWS_IMAGES[0];
  document.getElementById('image-grid').querySelectorAll('.img-thumb').forEach(t => t.classList.remove('selected'));
  document.getElementById('image-grid').querySelector('.img-thumb').classList.add('selected');
  document.getElementById('publish-btn').textContent = 'Опубликовать';
  document.getElementById('cancel-edit-btn').style.display = 'none';
  document.getElementById('edit-banner').style.display = 'none';
  updatePreview();
}

async function deleteNews(id) {
  if (!confirm('Удалить эту новость?')) return;
  try {
    await api.news.delete(id);
    showToast('Новость удалена', 'success');
    loadNews();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Users management ──────────────────────────────────────────────────────────

async function loadUsers() {
  const tbody = document.getElementById('users-list');
  if (!tbody) return;
  try {
    const users = await api.users.list();
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#999">Пользователей нет</td></tr>`;
      return;
    }
    tbody.innerHTML = users.map(u => {
      const isSelf = u.id === currentAdminId;
      const roleHtml = u.role === 'admin'
        ? '<span class="role-badge role-admin">⭐ Админ</span>'
        : '<span class="role-badge role-user">👤 Пользователь</span>';
      const actionsHtml = isSelf
        ? '<span style="font-size:.8em;color:#999">Это вы</span>'
        : `
          ${u.role === 'user'
            ? `<button class="action-btn btn-promote" onclick="updateUserRole('${u.id}', 'admin')">Назначить админом</button>`
            : `<button class="action-btn btn-demote"  onclick="updateUserRole('${u.id}', 'user')">Снять права</button>`
          }
          <button class="action-btn btn-delete" onclick="deleteUser('${u.id}', '${escapeHtml(u.username)}')">Удалить</button>
        `;
      return `
        <tr>
          <td><strong>${escapeHtml(u.username)}</strong></td>
          <td>${roleHtml}</td>
          <td style="font-size:.85em;color:#888;white-space:nowrap">${formatDateShort(u.createdAt)}</td>
          <td>${actionsHtml}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:red;padding:12px">Ошибка: ${escapeHtml(err.message)}</td></tr>`;
  }
}

async function updateUserRole(id, role) {
  try {
    await api.users.updateRole(id, role);
    showToast(role === 'admin' ? 'Пользователь назначен администратором' : 'Права администратора сняты', 'success');
    loadUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteUser(id, username) {
  if (!confirm(`Удалить пользователя «${username}»? Это действие необратимо.`)) return;
  try {
    await api.users.delete(id);
    showToast('Пользователь удалён', 'success');
    loadUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function toggleFormData(rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  row.style.display = row.style.display === 'none' ? '' : 'none';
}

// Expose for onclick handlers
window.updateCitizenStatus = updateCitizenStatus;
window.toggleFormData      = toggleFormData;
window.updateAppStatus     = updateAppStatus;
window.editNews            = editNews;
window.deleteNews          = deleteNews;
window.updateUserRole      = updateUserRole;
window.deleteUser          = deleteUser;
