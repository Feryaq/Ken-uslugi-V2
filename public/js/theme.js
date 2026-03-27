(function () {
  // Apply saved theme immediately (before render to avoid flash)
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const isDark = () => document.documentElement.classList.contains('dark');

  const update = () => {
    btn.textContent = isDark() ? '☀️' : '🌙';
    btn.title       = isDark() ? 'Светлая тема' : 'Тёмная тема';
  };

  update();

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark() ? 'dark' : 'light');
    update();
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);
