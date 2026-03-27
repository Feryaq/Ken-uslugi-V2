/**
 * main.js — Home page logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Update nav based on auth state
  await updateNavbar();

  // Load popular services
  loadPopularServices();

  // Load categories
  loadCategories();

  // Search form
  const searchForm = document.getElementById('hero-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('hero-search-input').value.trim();
      if (q) {
        window.location.href = `/services.html?search=${encodeURIComponent(q)}`;
      } else {
        window.location.href = '/services.html';
      }
    });
  }

  // Search button on services section
  const searchBtn = document.getElementById('go-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = document.getElementById('services-search-input').value.trim();
      window.location.href = `/services.html?search=${encodeURIComponent(q)}`;
    });
  }
});

async function loadPopularServices() {
  const grid = document.getElementById('popular-services-grid');
  if (!grid) return;

  grid.innerHTML = `<div class="loading-overlay" style="grid-column:1/-1"><div class="spinner"></div><span>Загрузка...</span></div>`;

  try {
    const data = await api.services.list({ popular: true });
    const services = data.services || [];

    if (services.length === 0) {
      grid.innerHTML = `<p class="text-muted" style="grid-column:1/-1">Нет популярных услуг</p>`;
      return;
    }

    grid.innerHTML = services.slice(0, 6).map(s => buildServiceCard(s)).join('');

  } catch (err) {
    grid.innerHTML = `<p class="text-muted" style="grid-column:1/-1">Не удалось загрузить услуги</p>`;
    console.error(err);
  }
}

async function loadCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  try {
    const [catData, servData] = await Promise.all([
      api.services.categories(),
      api.services.list()
    ]);

    const categories = catData.categories || [];
    const allServices = servData.services || [];

    grid.innerHTML = categories.map(cat => {
      const count = allServices.filter(s => s.category === cat).length;
      const icon  = getCategoryIcon(cat);
      return `
        <a href="/services.html?category=${encodeURIComponent(cat)}" class="category-card">
          <span class="category-icon">${icon}</span>
          <span>${escapeHtml(cat)}</span>
          <small>${count} услуг${count === 1 ? 'а' : count < 5 ? 'и' : ''}</small>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

function buildServiceCard(s) {
  const icon = getCategoryIcon(s.category);
  const costPill = s.cost === 'Бесплатно'
    ? `<span class="meta-pill pill-free">🆓 Бесплатно</span>`
    : `<span class="meta-pill pill-cost">💳 ${escapeHtml(s.cost)}</span>`;

  return `
    <a href="/service.html?id=${s.id}" class="service-card" style="text-decoration:none">
      <div class="service-card-header">
        <div class="service-icon">${icon}</div>
        <h3>${escapeHtml(s.title)}</h3>
      </div>
      <p>${escapeHtml(s.description)}</p>
      <div class="service-meta">
        <span class="meta-pill pill-duration">⏱ ${escapeHtml(s.duration)}</span>
        ${costPill}
      </div>
    </a>
  `;
}

window.buildServiceCard = buildServiceCard;
